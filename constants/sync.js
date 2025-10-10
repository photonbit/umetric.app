// constants/sync.js

export const SYNC_FREQUENCY = {
  MANUAL: 'Manual',
  AUTO: 'Auto', 
  NEVER: 'Never'
}

export const SYNC_INTERVALS = {
  [SYNC_FREQUENCY.MANUAL]: null, // No automatic sync
  [SYNC_FREQUENCY.AUTO]: 5 * 60 * 1000, // 5 minutes
  [SYNC_FREQUENCY.NEVER]: null // No sync at all
}

export const SYNC_STATUS = {
  IDLE: 'idle',
  SYNCING: 'syncing',
  SUCCESS: 'success',
  ERROR: 'error'
}

export const SYNC_ERRORS = {
  CONFIG_INCOMPLETE: 'Sync configuration incomplete',
  NO_USER: 'No user found',
  SYNC_DISABLED: 'Sync not configured or disabled',
  SYNC_IN_PROGRESS: 'Sync already in progress',
  NETWORK_ERROR: 'Network error during sync',
  SERVER_ERROR: 'Server error during sync'
}
