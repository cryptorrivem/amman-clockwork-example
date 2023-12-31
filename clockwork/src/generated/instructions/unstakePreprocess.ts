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
 * @category UnstakePreprocess
 * @category generated
 */
export const unstakePreprocessStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'UnstakePreprocessInstructionArgs'
)
/**
 * Accounts required by the _unstakePreprocess_ instruction
 *
 * @property [] config
 * @property [] registry
 * @property [**signer**] thread
 * @property [] unstake
 * @category Instructions
 * @category UnstakePreprocess
 * @category generated
 */
export type UnstakePreprocessInstructionAccounts = {
  config: web3.PublicKey
  registry: web3.PublicKey
  thread: web3.PublicKey
  unstake: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const unstakePreprocessInstructionDiscriminator = [
  200, 33, 121, 33, 33, 188, 12, 149,
]

/**
 * Creates a _UnstakePreprocess_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category UnstakePreprocess
 * @category generated
 */
export function createUnstakePreprocessInstruction(
  accounts: UnstakePreprocessInstructionAccounts,
  programId = new web3.PublicKey('F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa')
) {
  const [data] = unstakePreprocessStruct.serialize({
    instructionDiscriminator: unstakePreprocessInstructionDiscriminator,
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
    {
      pubkey: accounts.unstake,
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
