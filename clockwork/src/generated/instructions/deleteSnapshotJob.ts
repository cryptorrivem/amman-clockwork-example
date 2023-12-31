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
 * @category DeleteSnapshotJob
 * @category generated
 */
export const deleteSnapshotJobStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'DeleteSnapshotJobInstructionArgs'
)
/**
 * Accounts required by the _deleteSnapshotJob_ instruction
 *
 * @property [] config
 * @property [] registry
 * @property [**signer**] thread
 * @category Instructions
 * @category DeleteSnapshotJob
 * @category generated
 */
export type DeleteSnapshotJobInstructionAccounts = {
  config: web3.PublicKey
  registry: web3.PublicKey
  thread: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const deleteSnapshotJobInstructionDiscriminator = [
  134, 238, 139, 177, 87, 133, 245, 216,
]

/**
 * Creates a _DeleteSnapshotJob_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category DeleteSnapshotJob
 * @category generated
 */
export function createDeleteSnapshotJobInstruction(
  accounts: DeleteSnapshotJobInstructionAccounts,
  programId = new web3.PublicKey('F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa')
) {
  const [data] = deleteSnapshotJobStruct.serialize({
    instructionDiscriminator: deleteSnapshotJobInstructionDiscriminator,
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
      pubkey: accounts.thread,
      isWritable: false,
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
