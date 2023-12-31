/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category TakeSnapshotCreateEntry
 * @category generated
 */
export const takeSnapshotCreateEntryStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'TakeSnapshotCreateEntryInstructionArgs'
)
/**
 * Accounts required by the _takeSnapshotCreateEntry_ instruction
 *
 * @property [] config
 * @property [] delegation
 * @property [_writable_, **signer**] payer
 * @property [] registry
 * @property [] snapshot
 * @property [_writable_] snapshotEntry
 * @property [_writable_] snapshotFrame
 * @property [**signer**] thread
 * @property [] worker
 * @category Instructions
 * @category TakeSnapshotCreateEntry
 * @category generated
 */
export type TakeSnapshotCreateEntryInstructionAccounts = {
  config: web3.PublicKey
  delegation: web3.PublicKey
  payer: web3.PublicKey
  registry: web3.PublicKey
  snapshot: web3.PublicKey
  snapshotEntry: web3.PublicKey
  snapshotFrame: web3.PublicKey
  systemProgram?: web3.PublicKey
  thread: web3.PublicKey
  worker: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const takeSnapshotCreateEntryInstructionDiscriminator = [
  91, 246, 69, 70, 188, 59, 19, 145,
]

/**
 * Creates a _TakeSnapshotCreateEntry_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category TakeSnapshotCreateEntry
 * @category generated
 */
export function createTakeSnapshotCreateEntryInstruction(
  accounts: TakeSnapshotCreateEntryInstructionAccounts,
  programId = new web3.PublicKey('F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa')
) {
  const [data] = takeSnapshotCreateEntryStruct.serialize({
    instructionDiscriminator: takeSnapshotCreateEntryInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.config,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.delegation,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.registry,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.snapshot,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.snapshotEntry,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.snapshotFrame,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.thread,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.worker,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
