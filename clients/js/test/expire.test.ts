import { LockTimeNotOverError, UserStakedMint } from "../src/generated";
import { InitTransactions, killStuckProcess } from "./setup";
import { PDA, assertTx } from "./utils";
import { test } from "./utils/asserts";

killStuckProcess();

test("expire", async (t) => {
  const context = `expire+${Date.now()}`;
  const API = new InitTransactions();
  const { fstTxHandler, keypair: payer, connection } = await API.payer();
  const { collection } = await API.collection(context, payer, connection);
  const { keypair: staker1 } = await API.staker1();

  const lockTime0 = 5;
  const lockTime1 = 7;

  const [nft0] = await API.createAndStakeNFT(
    t,
    0,
    1,
    payer,
    payer,
    collection,
    staker1,
    lockTime0,
    fstTxHandler,
    connection
  );
  const [nft1] = await API.createAndStakeNFT(
    t,
    1,
    1,
    payer,
    payer,
    collection,
    staker1,
    lockTime1,
    fstTxHandler,
    connection
  );

  test("before lock time is over", async (t) => {
    const { tx: txUnstake } = await API.expire(
      payer,
      nft0,
      fstTxHandler,
      connection,
      false
    );

    await txUnstake.assertError(t, LockTimeNotOverError);
  });

  test("awaiting for expire to be called by clockwork", async (t) => {
    await API.waitUntilExpired(nft0, connection);

    const [userStakedMint] = PDA.userStakedMint(nft0);

    const updatedUserStakedMintAccount =
      await UserStakedMint.fromAccountAddress(connection, userStakedMint);
    t.isEqual(
      updatedUserStakedMintAccount.expired,
      true,
      "user staked mint account is expired"
    );
  });

  test("can be unstaked", async (t) => {
    await assertTx(t, API.unstake(staker1, nft0, fstTxHandler, connection));

    const [userStakedMint] = PDA.userStakedMint(nft0);
    const [thread] = PDA.thread(
      PDA.threadAuthority(nft0)[0],
      userStakedMint.toBuffer().subarray(0, 16)
    );
    const accountInfo = await connection.getAccountInfo(thread);
    t.isEqual(accountInfo, null, "thread account was closed");
  });

  test("can be expired again", async (t) => {
    await API.waitUntilExpired(nft1, connection);

    const [userStakedMint] = PDA.userStakedMint(nft1);
    const userStakedMintAccount = await UserStakedMint.fromAccountAddress(
      connection,
      userStakedMint
    );

    await assertTx(
      t,
      API.expire(staker1, nft1, fstTxHandler, connection, false)
    );

    const updatedUserStakedMintAccount =
      await UserStakedMint.fromAccountAddress(connection, userStakedMint);

    t.deepEqualExt(
      updatedUserStakedMintAccount,
      userStakedMintAccount,
      "user staked mint account did not change"
    );
  });
});
