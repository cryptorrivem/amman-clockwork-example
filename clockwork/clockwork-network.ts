import { ClockworkProvider } from "@clockwork-xyz/sdk";
import { AnchorProvider } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import fs from "fs";
import {
  ConfigSettings,
  PROGRAM_ID,
  createConfigUpdateInstruction,
  createDeleteSnapshotJobInstruction,
  createDistributeFeesJobInstruction,
  createIncrementEpochInstruction,
  createProcessUnstakesJobInstruction,
  createRegistryNonceHashInstruction,
  createStakeDelegationsJobInstruction,
  createTakeSnapshotJobInstruction,
} from "./src/generated";

const [_1, _2, keypairFile, mint] = process.argv;

export function getKeypair(rawPrivateKey: string) {
  if (fs.existsSync(rawPrivateKey)) {
    rawPrivateKey = fs.readFileSync(rawPrivateKey, "utf-8");
  }
  return Keypair.fromSecretKey(new Uint8Array(JSON.parse(rawPrivateKey)));
}

async function createEpochThread(
  clockworkProvider: ClockworkProvider,
  config: PublicKey,
  registry: PublicKey
): Promise<[TransactionInstruction, PublicKey]> {
  let thread_id = "clockwork.network.epoch";
  let [thread] = clockworkProvider.getThreadPDA(
    clockworkProvider.anchorProvider.publicKey,
    thread_id
  );
  let instructions = [
    createDistributeFeesJobInstruction({
      config,
      registry,
      thread,
    }),
    createProcessUnstakesJobInstruction({
      config,
      registry,
      thread,
    }),
    createStakeDelegationsJobInstruction({
      config,
      registry,
      thread,
    }),
    createTakeSnapshotJobInstruction({
      config,
      registry,
      thread,
    }),
    createIncrementEpochInstruction({
      config,
      registry,
      thread,
    }),
    createDeleteSnapshotJobInstruction({
      config,
      registry,
      thread,
    }),
  ];

  const instruction = await clockworkProvider.threadCreate(
    clockworkProvider.anchorProvider.publicKey,
    thread_id,
    instructions,
    { cron: { schedule: "0 * * * * * *", skippable: true } },
    LAMPORTS_PER_SOL
  );

  return [instruction, thread];
}

async function createHasherThread(
  clockworkProvider: ClockworkProvider,
  config: PublicKey,
  registry: PublicKey
): Promise<[TransactionInstruction, PublicKey]> {
  let thread_id = "clockwork.network.hasher";
  let [thread] = clockworkProvider.getThreadPDA(
    clockworkProvider.anchorProvider.publicKey,
    thread_id
  );

  let instructions = [
    createRegistryNonceHashInstruction({
      config,
      registry,
      thread,
    }),
  ];

  const instruction = await clockworkProvider.threadCreate(
    clockworkProvider.anchorProvider.publicKey,
    thread_id,
    instructions,
    { cron: { schedule: "*/15 * * * * * *", skippable: true } }
  );

  return [instruction, thread];
}

(async function () {
  const connection = new Connection("http://127.0.0.1:8899", "processed");
  const payer = getKeypair(keypairFile);
  const provider = new AnchorProvider(
    connection,
    new NodeWallet(payer),
    AnchorProvider.defaultOptions()
  );
  const clockworkProvider = ClockworkProvider.fromAnchorProvider(provider);

  const [config] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  );
  const [registry] = PublicKey.findProgramAddressSync(
    [Buffer.from("registry")],
    PROGRAM_ID
  );

  const [epochThreadIx, epochThread] = await createEpochThread(
    clockworkProvider,
    config,
    registry
  );
  const [hasherThreadIx, hasherThread] = await createHasherThread(
    clockworkProvider,
    config,
    registry
  );
  const settings: ConfigSettings = {
    admin: provider.publicKey,
    epochThread,
    hasherThread,
    mint: new PublicKey(mint),
  };
  const configUpdateIx = createConfigUpdateInstruction(
    {
      admin: provider.publicKey,
      config,
    },
    { settings }
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();

  console.info("Creating epoch threads");
  await sendAndConfirmTransaction(
    connection,
    new Transaction({
      blockhash,
      lastValidBlockHeight,
    }).add(epochThreadIx),
    [payer]
  );

  console.info("Creating hasher threads and updating config");
  await sendAndConfirmTransaction(
    connection,
    new Transaction({
      blockhash,
      lastValidBlockHeight,
    }).add(hasherThreadIx, configUpdateIx),
    [payer]
  );
})();
