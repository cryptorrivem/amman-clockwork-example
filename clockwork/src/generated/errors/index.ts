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
 * AlreadyInPool: 'The worker is already in the pool'
 *
 * @category Errors
 * @category generated
 */
export class AlreadyInPoolError extends Error {
  readonly code: number = 0x1770
  readonly name: string = 'AlreadyInPool'
  constructor() {
    super('The worker is already in the pool')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AlreadyInPoolError)
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new AlreadyInPoolError())
createErrorFromNameLookup.set('AlreadyInPool', () => new AlreadyInPoolError())

/**
 * InvalidCommissionRate: 'The commission rate must be an integer between 0 and 100'
 *
 * @category Errors
 * @category generated
 */
export class InvalidCommissionRateError extends Error {
  readonly code: number = 0x1771
  readonly name: string = 'InvalidCommissionRate'
  constructor() {
    super('The commission rate must be an integer between 0 and 100')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidCommissionRateError)
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new InvalidCommissionRateError())
createErrorFromNameLookup.set(
  'InvalidCommissionRate',
  () => new InvalidCommissionRateError()
)

/**
 * InvalidUnstakeAmount: 'You cannot request to unstake more tokens than are currently locked'
 *
 * @category Errors
 * @category generated
 */
export class InvalidUnstakeAmountError extends Error {
  readonly code: number = 0x1772
  readonly name: string = 'InvalidUnstakeAmount'
  constructor() {
    super('You cannot request to unstake more tokens than are currently locked')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidUnstakeAmountError)
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new InvalidUnstakeAmountError())
createErrorFromNameLookup.set(
  'InvalidUnstakeAmount',
  () => new InvalidUnstakeAmountError()
)

/**
 * InsufficientPenaltyBalance: 'The penalty account has an insufficient balance for this operation'
 *
 * @category Errors
 * @category generated
 */
export class InsufficientPenaltyBalanceError extends Error {
  readonly code: number = 0x1773
  readonly name: string = 'InsufficientPenaltyBalance'
  constructor() {
    super('The penalty account has an insufficient balance for this operation')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InsufficientPenaltyBalanceError)
    }
  }
}

createErrorFromCodeLookup.set(
  0x1773,
  () => new InsufficientPenaltyBalanceError()
)
createErrorFromNameLookup.set(
  'InsufficientPenaltyBalance',
  () => new InsufficientPenaltyBalanceError()
)

/**
 * InvalidSignatory: 'The authority address cannot be used as the worker signatory'
 *
 * @category Errors
 * @category generated
 */
export class InvalidSignatoryError extends Error {
  readonly code: number = 0x1774
  readonly name: string = 'InvalidSignatory'
  constructor() {
    super('The authority address cannot be used as the worker signatory')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidSignatoryError)
    }
  }
}

createErrorFromCodeLookup.set(0x1774, () => new InvalidSignatoryError())
createErrorFromNameLookup.set(
  'InvalidSignatory',
  () => new InvalidSignatoryError()
)

/**
 * RegistryLocked: 'The registry is locked and may not be updated right now'
 *
 * @category Errors
 * @category generated
 */
export class RegistryLockedError extends Error {
  readonly code: number = 0x1775
  readonly name: string = 'RegistryLocked'
  constructor() {
    super('The registry is locked and may not be updated right now')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, RegistryLockedError)
    }
  }
}

createErrorFromCodeLookup.set(0x1775, () => new RegistryLockedError())
createErrorFromNameLookup.set('RegistryLocked', () => new RegistryLockedError())

/**
 * PoolFull: 'The worker cannot rotate into the pool right now'
 *
 * @category Errors
 * @category generated
 */
export class PoolFullError extends Error {
  readonly code: number = 0x1776
  readonly name: string = 'PoolFull'
  constructor() {
    super('The worker cannot rotate into the pool right now')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, PoolFullError)
    }
  }
}

createErrorFromCodeLookup.set(0x1776, () => new PoolFullError())
createErrorFromNameLookup.set('PoolFull', () => new PoolFullError())

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