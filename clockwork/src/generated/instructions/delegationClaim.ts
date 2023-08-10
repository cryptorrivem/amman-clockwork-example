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
 * @category DelegationClaim
 * @category generated
 */
export type DelegationClaimInstructionArgs = {
  amount: beet.bignum
}
/**
 * @category Instructions
 * @category DelegationClaim
 * @category generated
 */
export const delegationClaimStruct = new beet.BeetArgsStruct<
  DelegationClaimInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
  ],
  'DelegationClaimInstructionArgs'
)
/**
 * Accounts required by the _delegationClaim_ instruction
 *
 * @property [**signer**] authority
 * @property [_writable_] payTo
 * @property [_writable_] delegation
 * @category Instructions
 * @category DelegationClaim
 * @category generated
 */
export type DelegationClaimInstructionAccounts = {
  authority: web3.PublicKey
  payTo: web3.PublicKey
  delegation: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const delegationClaimInstructionDiscriminator = [
  241, 93, 229, 251, 113, 208, 59, 109,
]

/**
 * Creates a _DelegationClaim_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category DelegationClaim
 * @category generated
 */
export function createDelegationClaimInstruction(
  accounts: DelegationClaimInstructionAccounts,
  args: DelegationClaimInstructionArgs,
  programId = new web3.PublicKey('F8dKseqmBoAkHx3c58Lmb9TgJv5qeTf3BbtZZSEzYvUa')
) {
  const [data] = delegationClaimStruct.serialize({
    instructionDiscriminator: delegationClaimInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: accounts.payTo,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.delegation,
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
