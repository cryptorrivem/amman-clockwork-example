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
 * @category DeleteSnapshotProcessFrame
 * @category generated
 */
export const deleteSnapshotProcessFrameStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'DeleteSnapshotProcessFrameInstructionArgs'
)
/**
 * Accounts required by the _deleteSnapshotProcessFrame_ instruction
 *
 * @property [] config
 * @property [] registry
 * @property [_writable_] snapshot
 * @property [_writable_] snapshotFrame
 * @property [_writable_, **signer**] thread
 * @category Instructions
 * @category DeleteSnapshotProcessFrame
 * @category generated
 */
export type DeleteSnapshotProcessFrameInstructionAccounts = {
  config: web3.PublicKey
  registry: web3.PublicKey
  snapshot: web3.PublicKey
  snapshotFrame: web3.PublicKey
  thread: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const deleteSnapshotProcessFrameInstructionDiscriminator = [
  207, 211, 99, 154, 230, 122, 74, 161,
]

/**
 * Creates a _DeleteSnapshotProcessFrame_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category DeleteSnapshotProcessFrame
 * @category generated
 */
export function createDeleteSnapshotProcessFrameInstruction(
  accounts: DeleteSnapshotProcessFrameInstructionAccounts,
  programId = new web3.PublicKey('F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa')
) {
  const [data] = deleteSnapshotProcessFrameStruct.serialize({
    instructionDiscriminator:
      deleteSnapshotProcessFrameInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.config,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.registry,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.snapshot,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.snapshotFrame,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.thread,
      isWritable: true,
      isSigner: true,
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
