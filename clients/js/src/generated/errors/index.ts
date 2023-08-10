/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ErrorWithCode = Error & { code: number }
type MaybeErrorWithCode = ErrorWithCode | null | undefined

const createErrorFromCodeLookup: Map<number, () => ErrorWithCode> = new Map()
const createErrorFromNameLookup: Map<string, () => ErrorWithCode> = new Map()

/**
 * NotOwnerOfMint: 'NFT does not belong to user'
 *
 * @category Errors
 * @category generated
 */
export class NotOwnerOfMintError extends Error {
  readonly code: number = 0x1770
  readonly name: string = 'NotOwnerOfMint'
  constructor() {
    super('NFT does not belong to user')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, NotOwnerOfMintError)
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new NotOwnerOfMintError())
createErrorFromNameLookup.set('NotOwnerOfMint', () => new NotOwnerOfMintError())

/**
 * LockTimeNotOver: 'NFT lock time is not over'
 *
 * @category Errors
 * @category generated
 */
export class LockTimeNotOverError extends Error {
  readonly code: number = 0x1771
  readonly name: string = 'LockTimeNotOver'
  constructor() {
    super('NFT lock time is not over')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, LockTimeNotOverError)
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new LockTimeNotOverError())
createErrorFromNameLookup.set(
  'LockTimeNotOver',
  () => new LockTimeNotOverError()
)

/**
 * NotExpired: 'NFT lock must be expired before unstaking'
 *
 * @category Errors
 * @category generated
 */
export class NotExpiredError extends Error {
  readonly code: number = 0x1772
  readonly name: string = 'NotExpired'
  constructor() {
    super('NFT lock must be expired before unstaking')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, NotExpiredError)
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new NotExpiredError())
createErrorFromNameLookup.set('NotExpired', () => new NotExpiredError())

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
  const createError = createErrorFromCodeLookup.get(code)
  return createError != null ? createError() : null
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
export function errorFromName(name: string): MaybeErrorWithCode {
  const createError = createErrorFromNameLookup.get(name)
  return createError != null ? createError() : null
}