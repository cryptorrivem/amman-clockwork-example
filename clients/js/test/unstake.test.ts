import test from "tape";
import { NotExpiredError, NotOwnerOfMintError } from "../src/generated";
import { InitTransactions, killStuckProcess } from "./setup";
import { PDA } from "./utils";

killStuckProcess();

test("unstake", async (t) => {
  const context = `unstake+${Date.now()}`;
  const API = new InitTransactions();
  const { fstTxHandler, keypair: payer, connection } = await API.payer();
  const { collection } = await API.collection(context, payer, connection);
  const { keypair: staker1 } = await API.staker1();
  const { keypair: staker2 } = await API.staker2();

  const lockTime = 10;
  const [nftUser1] = await API.createAndStakeNFT(
    t,
    0,
    1,
    payer,
    payer,
    collection,
    staker1,
    lockTime,
    fstTxHandler,
    connection
  );

  test("with invalid user", async (t) => {
    const { tx: txUnstake } = await API.unstake(
      staker2,
      nftUser1,
      fstTxHandler,
      connection
    );

    await txUnstake.assertError(t, NotOwnerOfMintError);
  });

  test("when locked by time", async (t) => {
    const { tx: txUnstake } = await API.unstake(
      staker1,
      nftUser1,
      fstTxHandler,
      connection
    );

    await txUnstake.assertError(t, NotExpiredError);
  });

  test("after lock expired", async (t) => {
    const [userStakedMint] = PDA.userStakedMint(nftUser1);

    await API.waitUntilExpired(nftUser1, connection);

    const { tx: txUnstake } = await API.unstake(
      staker1,
      nftUser1,
      fstTxHandler,
      connection
    );

    await txUnstake.assertSuccess(t);

    const updatedUserStakedMintAccount = await connection.getAccountInfo(
      userStakedMint
    );

    t.notOk(updatedUserStakedMintAccount, "user staked mint was deallocated");
  });
});
