import { BN } from "bn.js";
import { InitTransactions, killStuckProcess } from "./setup";
import { test } from "./utils/asserts";

killStuckProcess();

test("stake", async (t) => {
  const context = `stake+${Date.now()}`;
  const API = new InitTransactions();
  const { fstTxHandler, keypair: payer, connection } = await API.payer();
  const { collection } = await API.collection(context, payer, connection);
  const { keypair: staker1 } = await API.staker1();

  test("stake with lock time", async (t) => {
    const nft = await API.createNFT(
      0,
      collection,
      payer,
      payer,
      connection,
      staker1.publicKey
    );

    const lockTime = 10;
    const { tx: txStake, userStakedMint } = await API.stake(
      staker1,
      nft,
      lockTime,
      fstTxHandler,
      connection
    );

    await txStake.assertSuccess(t);

    const userStakedMintAccount = await API.readUserStakedMint(
      userStakedMint,
      connection
    );

    t.deepEqualExt(
      userStakedMintAccount.user,
      staker1.publicKey,
      "nft staked user"
    );
    t.equal(
      new BN(userStakedMintAccount.lockTime).toNumber(),
      lockTime,
      "nft staked with lock time"
    );
    t.true(userStakedMintAccount.startTime, "nft staked start time set");
  });
});
