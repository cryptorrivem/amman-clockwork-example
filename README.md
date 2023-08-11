# Amman Clockwork example

This is an example of integrating a geyser plugin (like Clockwork) with Amman for managing a Solana test validator for local testing.

> While the [feature request](https://github.com/metaplex-foundation/amman/pull/66) is not deployed to npm, you'll need to [pull my fork](https://github.com/cryptorrivem/amman/tree/geyser-plugins) and build the Amman code at the `geyser-plugins` branch. Later go to this example `package.json` and point the dependency `@metaplex-foundation/amman` to the directory you have cloned the forked repo

## Description

The example program allows to `stake` a `pNFT` an set a `lock_time` while it cannot be unstaked. The `stake` instruction will create a Clockwork thread that will call the `expire` instruction once the lock time expires. Then the nft is enabled to be unstaken.

## Testing

Build the program by running:

`npm run programs:build`

Then launch the validator with:

`npm run validator:debug`

This command will start the validator as usual (with the geyser plugin), but also trigger a script that creates the necesary accounts for Clockwork -check [`clockwork localnet` source code](https://github.com/clockwork-xyz/clockwork/blob/f87f5f1f44d8d2418e86a1fe8cb5df6dce098c3e/cli/src/processor/localnet.rs#L52)-. Await until the Clockwork setup is over (logs will stop printing often), and start testing the program.

To run all the program test:

`cd clients/js && sh run-test.sh -a`

> or replace `-a` with the test file you want to run specifically, such as `test/stake.test.ts`
