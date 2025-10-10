// utils/syncService.js
import { synchronize } from '@nozbe/watermelondb/sync'
import { getCurrentUser } from './userUtils'
import { SYNC_FREQUENCY, SYNC_INTERVALS, SYNC_ERRORS } from '../constants/sync'

let syncInterval = null
let isCurrentlySyncing = false

/**
 * Creates a sync adapter for pushing changes to the server
 * @param {Database} database - WatermelonDB database instance
 * @param {Object} user - User object with sync configuration
 * @returns {Object} Sync adapter configuration
 */
export function createSyncAdapter(database, user) {
  return {
    async pullChanges({ lastPulledAt, schemaVersion, migration }) {
      // We're only implementing push for now, so return empty changes
      return {
        changes: {},
        timestamp: Date.now(),
      }
    },

    async pushChanges({ changes, lastPulledAt }) {
      console.log(changes)
      if (!user.serverUrl || !user.username || !user.password) {
        throw new Error(SYNC_ERRORS.CONFIG_INCOMPLETE)
      }

      const serverUrl = user.serverUrl.endsWith('/') ? user.serverUrl : `${user.serverUrl}/`
      const syncEndpoint = `${serverUrl}api/sync`

      try {
        // Prepare authentication
        const auth = btoa(`${user.username}:${user.password}`)
        
        // Prepare sync data
        const syncData = {
          changes,
          lastPulledAt,
          schemaVersion: database.schema.version,
          userId: user.id,
          timestamp: Date.now()
        }

        // Add encryption if encryption key is provided
        if (user.encryptionKey) {
          // For now, we'll send the data as-is
          // In a real implementation, you'd encrypt the data here
          syncData.encrypted = false
          syncData.encryptionKey = user.encryptionKey
        }

        const response = await fetch(syncEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
            'X-User-ID': user.id,
            'X-Schema-Version': database.schema.version.toString()
          },
          body: JSON.stringify(syncData)
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Sync failed: ${response.status} ${response.statusText} - ${errorText}`)
        }

        const result = await response.json()
        return result
      } catch (error) {
        console.error('Sync push error:', error)
        throw error
      }
    },

    async synchronize() {
      // This is called by WatermelonDB's synchronize function
      // We don't need to implement anything here as we're only pushing
      return {
        changes: {},
        timestamp: Date.now()
      }
    }
  }
}

/**
 * Performs a manual sync operation
 * @param {Database} database - WatermelonDB database instance
 * @returns {Promise<Object>} Sync result
 */
export async function performManualSync(database) {
  if (isCurrentlySyncing) {
    throw new Error(SYNC_ERRORS.SYNC_IN_PROGRESS)
  }

  const user = await getCurrentUser(database)
  if (!user) {
    throw new Error(SYNC_ERRORS.NO_USER)
  }

  if (user.syncFrequency === SYNC_FREQUENCY.NEVER || !user.serverUrl || !user.username || !user.password) {
    throw new Error(SYNC_ERRORS.SYNC_DISABLED)
  }

  isCurrentlySyncing = true

  try {
    const syncAdapter = createSyncAdapter(database, user)
    const result = await synchronize({
      database,
      pullChanges: syncAdapter.pullChanges,
      pushChanges: syncAdapter.pushChanges,
      migrationsEnabledAtVersion: 1,
    })

    return {
      success: true,
      timestamp: Date.now(),
      changesPushed: result?.changes ? Object.keys(result.changes).length : 0
    }
  } catch (error) {
    console.error('Manual sync failed:', error)
    throw error
  } finally {
    isCurrentlySyncing = false
  }
}

/**
 * Starts automatic sync based on user configuration
 * @param {Database} database - WatermelonDB database instance
 */
export async function startAutomaticSync(database) {
  // Stop any existing sync
  stopAutomaticSync()

  const user = await getCurrentUser(database)
  if (!user || user.syncFrequency === SYNC_FREQUENCY.NEVER || user.syncFrequency === SYNC_FREQUENCY.MANUAL) {
    return
  }

  const interval = SYNC_INTERVALS[user.syncFrequency]
  if (!interval) {
    return
  }

  console.log(`Starting automatic sync with interval: ${interval}ms`)

  // Perform initial sync
  try {
    await performManualSync(database)
  } catch (error) {
    console.error('Initial automatic sync failed:', error)
  }

  // Set up interval for subsequent syncs
  syncInterval = setInterval(async () => {
    try {
      await performManualSync(database)
    } catch (error) {
      console.error('Automatic sync failed:', error)
    }
  }, interval)
}

/**
 * Stops automatic sync
 */
export function stopAutomaticSync() {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
    console.log('Automatic sync stopped')
  }
}

/**
 * Checks if sync is currently in progress
 * @returns {boolean}
 */
export function isSyncInProgress() {
  return isCurrentlySyncing
}

/**
 * Gets the current sync configuration for a user
 * @param {Database} database - WatermelonDB database instance
 * @returns {Promise<Object>} Sync configuration
 */
export async function getSyncConfiguration(database) {
  const user = await getCurrentUser(database)
  if (!user) {
    return {
      enabled: false,
      frequency: SYNC_FREQUENCY.NEVER,
      serverUrl: null,
      username: null,
      hasCredentials: false
    }
  }

  return {
    enabled: user.syncFrequency !== SYNC_FREQUENCY.NEVER,
    frequency: user.syncFrequency || SYNC_FREQUENCY.NEVER,
    serverUrl: user.serverUrl,
    username: user.username,
    hasCredentials: !!(user.serverUrl && user.username && user.password)
  }
}

/**
 * Validates sync configuration
 * @param {Object} config - Sync configuration object
 * @returns {Object} Validation result
 */
export function validateSyncConfiguration(config) {
  const errors = []

  if (!config.serverUrl || config.serverUrl.trim() === '') {
    errors.push('Server URL is required')
  } else {
    try {
      new URL(config.serverUrl)
    } catch {
      errors.push('Server URL must be a valid URL')
    }
  }

  if (!config.username || config.username.trim() === '') {
    errors.push('Username is required')
  }

  if (!config.password || config.password.trim() === '') {
    errors.push('Password is required')
  }

  return {
    isValid: errors.length === 0,
    errors
 }
}
