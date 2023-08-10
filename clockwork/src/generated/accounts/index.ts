export * from './Config'
export * from './Delegation'
export * from './Fee'
export * from './Penalty'
export * from './Pool'
export * from './Registry'
export * from './Snapshot'
export * from './SnapshotEntry'
export * from './SnapshotFrame'
export * from './Unstake'
export * from './Worker'

import { Config } from './Config'
import { Delegation } from './Delegation'
import { Fee } from './Fee'
import { Penalty } from './Penalty'
import { Pool } from './Pool'
import { Registry } from './Registry'
import { SnapshotEntry } from './SnapshotEntry'
import { SnapshotFrame } from './SnapshotFrame'
import { Snapshot } from './Snapshot'
import { Unstake } from './Unstake'
import { Worker } from './Worker'

export const accountProviders = {
  Config,
  Delegation,
  Fee,
  Penalty,
  Pool,
  Registry,
  SnapshotEntry,
  SnapshotFrame,
  Snapshot,
  Unstake,
  Worker,
}
