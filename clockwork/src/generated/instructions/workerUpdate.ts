/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { WorkerSettings, workerSettingsBeet } from '../types/WorkerSettings'

/**
 * @category Instructions
 * @category WorkerUpdate
 * @category generated
 */
export type WorkerUpdateInstructionArgs = {
  settings: WorkerSettings
}
/**
 * @category Instructions
 * @category WorkerUpdate
 * @category generated
 */
export const workerUpdateStruct = new beet.BeetArgsStruct<
  WorkerUpdateInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['settings', workerSettingsBeet],
  ],
  'WorkerUpdateInstructionArgs'
)
/**
 * Accounts required by the _workerUpdate_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [_writable_] worker
 * @category Instructions
 * @category WorkerUpdate
 * @category generated
 */
export type WorkerUpdateInstructionAccounts = {
  authority: web3.PublicKey
  systemProgram?: web3.PublicKey
  worker: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const workerUpdateInstructionDiscriminator = [
  50, 210, 142, 59, 200, 64, 212, 169,
]

/**
 * Creates a _WorkerUpdate_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WorkerUpdate
 * @category generated
 */
export function createWorkerUpdateInstruction(
  accounts: WorkerUpdateInstructionAccounts,
  args: WorkerUpdateInstructionArgs,
  programId = new web3.PublicKey('F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa')
) {
  const [data] = workerUpdateStruct.serialize({
    instructionDiscriminator: workerUpdateInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.worker,
      isWritable: true,
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
