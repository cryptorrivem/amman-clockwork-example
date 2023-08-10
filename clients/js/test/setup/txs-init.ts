import {
  ConfirmedTransactionAssertablePromise,
  GenLabeledKeypair,
  LoadOrGenKeypair,
  LOCALHOST,
  PayerTransactionHandler,
} from "@metaplex-foundation/amman-client";
import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import PromisePool from "@supercharge/promise-pool";
import { BN } from "bn.js";
import { Test } from "tape";
import { amman, sleep } from ".";
import * as program from "../../src/generated";
import {
  COLLECTION_METADATA,
  MPL_TOKEN_AUTH_RULES_PROGRAM_ID,
  NFT_METADATA,
  PDA,
  RULE_SET,
  THREAD_PROGRAM_ID,
} from "../utils";

export const MAX_PLANS = 8;

export class InitTransactions {
  readonly getKeypair: LoadOrGenKeypair | GenLabeledKeypair;

  constructor(readonly resuseKeypairs = false) {
    this.getKeypair = resuseKeypairs
      ? amman.loadOrGenKeypair
      : amman.genLabeledKeypair;
  }

  async keypairContext(name: string) {
    const [publicKey, keypair] = await this.getKeypair(name);

    const connection = new Connection(LOCALHOST, "confirmed");
    await amman.airdrop(connection, publicKey, 10);

    const transactionHandler = amman.payerTransactionHandler(
      connection,
      keypair
    );

    return {
      fstTxHandler: transactionHandler,
      connection,
      publicKey,
      keypair,
    };
  }

  computeUnitsInstruction() {
    return ComputeBudgetProgram.setComputeUnitLimit({
      units: 2 * 200_000,
    });
  }

  payer() {
    return this.keypairContext("Payer");
  }

  staker1() {
    return this.keypairContext("Staker1");
  }

  staker2() {
    return this.keypairContext("Staker2");
  }

  getMetaplex(connection: Connection, payer: Keypair) {
    return Metaplex.make(connection).use(keypairIdentity(payer));
  }

  async createNFT(
    i: number,
    collection: PublicKey,
    payer: Keypair,
    creator: Keypair,
    connection: Connection,
    receiver?: PublicKey
  ) {
    const metaplex = this.getMetaplex(connection, payer);
    const nftLabel = `${collection.toBase58().substring(0, 8)} NFT #${i}`;
    while (amman.addr.resolveLabel(nftLabel).length < 1) {
      const {
        nft: { address },
      } = await metaplex.nfts().create({
        uri: NFT_METADATA,
        name: nftLabel,
        creators:
          payer !== creator
            ? [
                { address: creator.publicKey, share: 0, authority: creator },
                { address: payer.publicKey, share: 100 },
              ]
            : undefined,
        sellerFeeBasisPoints: 0,
        collection,
        ruleSet: RULE_SET,
        tokenStandard: TokenStandard.ProgrammableNonFungible,
        tokenOwner: receiver,
        updateAuthority: payer,
      });

      await metaplex.nfts().verifyCollection({
        mintAddress: address,
        collectionMintAddress: collection,
        collectionAuthority: payer,
      });

      await amman.addr.addLabel(nftLabel, address);
    }
    return new PublicKey(amman.addr.resolveLabel(nftLabel)[0]);
  }

  async createCollection(
    label: string,
    size: number,
    payer: Keypair,
    connection: Connection
  ) {
    const metaplex = this.getMetaplex(connection, payer);

    // creates a collection nft
    const collectionLabel = `Collection ${label}`;
    while (amman.addr.resolveLabel(collectionLabel).length < 1) {
      const {
        nft: { address },
      } = await metaplex.nfts().create({
        uri: COLLECTION_METADATA,
        name: collectionLabel,
        sellerFeeBasisPoints: 0,
        isCollection: true,
      });
      await amman.addr.addLabel(collectionLabel, address);
    }
    const collection = new PublicKey(
      amman.addr.resolveLabel(collectionLabel)[0]
    );

    const { results: nfts } = await PromisePool.for(
      new Array(size).fill(0).map((_, ix) => ix)
    )
      .withConcurrency(50)
      .process((i) => this.createNFT(i, collection, payer, payer, connection));

    return {
      collection,
      nfts,
    };
  }

  async collection(label: string, payer: Keypair, connection: Connection) {
    const collectionLabel = label;
    const collectionSize = 0;
    const { collection, nfts } = await this.createCollection(
      collectionLabel,
      collectionSize,
      payer,
      connection
    );
    return { collection, nfts };
  }

  async stake(
    payer: Keypair,
    mint: PublicKey,
    lockTime: number,
    handler: PayerTransactionHandler,
    connection: Connection
  ): Promise<{
    tx: ConfirmedTransactionAssertablePromise;
    userStakedMint: PublicKey;
  }> {
    const metaplex = this.getMetaplex(connection, payer);
    const [userStakedMint] = PDA.userStakedMint(mint);
    const [threadAuthority] = PDA.threadAuthority(mint);
    const [thread] = PDA.thread(
      threadAuthority,
      userStakedMint.toBuffer().subarray(0, 16)
    );
    const token = metaplex
      .tokens()
      .pdas()
      .associatedTokenAccount({ mint, owner: payer.publicKey });
    const tokenRecord = metaplex.nfts().pdas().tokenRecord({ mint, token });
    const metadata = metaplex.nfts().pdas().metadata({ mint });
    const edition = metaplex.nfts().pdas().edition({ mint });
    const mplTokenMetadataProgram = metaplex
      .programs()
      .getTokenMetadata().address;

    const accounts: program.StakeInstructionAccounts = {
      userStakedMint,
      owner: payer.publicKey,
      thread,
      threadAuthority,
      mint,
      token,
      tokenRecord,
      metadata,
      edition,
      authorizationRules: RULE_SET,
      sysvarInstruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      mplTokenMetadataProgram,
      mplTokenAuthRulesProgram: MPL_TOKEN_AUTH_RULES_PROGRAM_ID,
      threadProgram: THREAD_PROGRAM_ID,
    };

    const ixComputeUnits = this.computeUnitsInstruction();
    const ixStake = program.createStakeInstruction(accounts, {
      lockTime: new BN(lockTime),
    });

    const tx = new Transaction().add(ixComputeUnits).add(ixStake);

    const txPromise = handler.sendAndConfirmTransaction(
      tx,
      [payer],
      "tx: Stake"
    );

    return { tx: txPromise, userStakedMint };
  }

  async readUserStakedMint(userStakedMint: PublicKey, connection: Connection) {
    const result = await program.UserStakedMint.fromAccountAddress(
      connection,
      userStakedMint
    );
    return result;
  }

  async createAndStakeNFT(
    t: Test,
    start: number,
    count: number,
    payer: Keypair,
    creator: Keypair,
    collection: PublicKey,
    staker: Keypair,
    lockTime: number,
    handler: PayerTransactionHandler,
    connection: Connection
  ) {
    const nfts = await Promise.all(
      new Array(count)
        .fill(0)
        .map((_, i) =>
          this.createNFT(
            start + i,
            collection,
            payer,
            creator,
            connection,
            staker.publicKey
          )
        )
    );
    await Promise.all(
      nfts.map((n) =>
        this.stake(staker, n, lockTime, handler, connection).then(({ tx }) =>
          tx.assertSuccess(t)
        )
      )
    );

    return nfts;
  }

  async waitUntilExpired(mint: PublicKey, connection: Connection) {
    const [userStakedMint] = PDA.userStakedMint(mint);
    do {
      const userStakedMintAccount =
        await program.UserStakedMint.fromAccountAddress(
          connection,
          userStakedMint
        );
      if (userStakedMintAccount.expired) {
        break;
      }
      console.info("Awaiting to expire...");
      await sleep(1000);
    } while (true);
  }

  async expire(
    payer: Keypair,
    mint: PublicKey,
    handler: PayerTransactionHandler,
    connection: Connection,
    waitToExpire: boolean
  ): Promise<{
    tx: ConfirmedTransactionAssertablePromise;
    userStakedMint: PublicKey;
  }> {
    const [userStakedMint] = PDA.userStakedMint(mint);

    if (waitToExpire) {
      const userStakedMintAccount =
        await program.UserStakedMint.fromAccountAddress(
          connection,
          userStakedMint
        );

      while (
        Number(userStakedMintAccount.startTime) +
          Number(userStakedMintAccount.lockTime) >
        Date.now() / 1000
      ) {
        console.info("Awaiting to expire...");
        await sleep(1000);
      }
    }

    const accounts: program.ExpireInstructionAccounts = {
      userStakedMint,
      mint,
    };

    const ixExpire = program.createExpireInstruction(accounts);
    const ixTransfer = SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: payer.publicKey,
      lamports: 1,
    });

    const tx = new Transaction().add(ixExpire, ixTransfer);

    const txPromise = handler.sendAndConfirmTransaction(
      tx,
      [payer],
      "tx: Expire"
    );

    return { tx: txPromise, userStakedMint };
  }

  async unstake(
    payer: Keypair,
    mint: PublicKey,
    handler: PayerTransactionHandler,
    connection: Connection
  ): Promise<{
    tx: ConfirmedTransactionAssertablePromise;
    userStakedMint: PublicKey;
  }> {
    const metaplex = this.getMetaplex(connection, payer);
    const [userStakedMint] = PDA.userStakedMint(mint);
    const [threadAuthority] = PDA.threadAuthority(mint);
    const [thread] = PDA.thread(
      threadAuthority,
      userStakedMint.toBuffer().subarray(0, 16)
    );
    const token = metaplex
      .tokens()
      .pdas()
      .associatedTokenAccount({ mint, owner: payer.publicKey });
    const tokenRecord = metaplex.nfts().pdas().tokenRecord({ mint, token });
    const metadata = metaplex.nfts().pdas().metadata({ mint });
    const edition = metaplex.nfts().pdas().edition({ mint });
    const mplTokenMetadataProgram = metaplex
      .programs()
      .getTokenMetadata().address;

    const accounts: program.UnstakeInstructionAccounts = {
      userStakedMint,
      owner: payer.publicKey,
      thread,
      threadAuthority,
      mint,
      token,
      tokenRecord,
      metadata,
      edition,
      authorizationRules: RULE_SET,
      sysvarInstruction: SYSVAR_INSTRUCTIONS_PUBKEY,
      mplTokenMetadataProgram,
      mplTokenAuthRulesProgram: MPL_TOKEN_AUTH_RULES_PROGRAM_ID,
      threadProgram: THREAD_PROGRAM_ID,
    };

    const ixComputeUnits = this.computeUnitsInstruction();
    const ixUnstake = program.createUnstakeInstruction(accounts);

    const tx = new Transaction().add(ixComputeUnits).add(ixUnstake);

    const txPromise = handler.sendAndConfirmTransaction(
      tx,
      [payer],
      "tx: Unstake"
    );

    return { tx: txPromise, userStakedMint };
  }
}
