// utils/userUtils.js
import { Q } from '@nozbe/watermelondb'

const CURRENT_USER_KEY = 'current_user_id'

export async function getCurrentUser(database) {
  const userId = await database.localStorage.get(CURRENT_USER_KEY)
  
  if (userId) {
    const user = await database.collections.get('users').find(userId)
    return user
  }
  
  const users = await database.collections.get('users').query().fetch()
  if (users.length > 0) {
    const user = users[0]
    // Store this user's ID for next time
    await database.localStorage.set(CURRENT_USER_KEY, user.id)
    return user
  }
  
  return null
}

export async function setCurrentUser(database, userId) {
  await database.localStorage.set(CURRENT_USER_KEY, userId)
}

export async function createAndSetCurrentUser(database, userData = {}) {
  const user = await database.write(async () => {
    return await database.collections.get('users').create((u) => {
      u.username = userData.username || ''
      u.email = userData.email || ''
      u.password = userData.password || ''
      u.createdAt = Date.now()
      u.firstName = userData.firstName || ''
      u.lastName = userData.lastName || ''
      u.sundayWeekStart = userData.sundayWeekStart || false
      u.serverUrl = userData.serverUrl || ''
      u.encryptionKey = userData.encryptionKey || ''
      u.syncFrequency = userData.syncFrequency || 'Never'
    })
  })
  
  await setCurrentUser(database, user.id)
  return user
}

/**
 * Migrates all data from old user ID to a new user ID coming from the server.
 * This will:
 * - Create a new user with the same fields but with id=newId
 * - Update CURRENT_USER_KEY in local storage
 * - Update all foreign keys (user_id) in related tables
 * - Delete the old user
 *
 * Returns the newly created user model.
 */
export async function migrateUserId(database, oldId, newId) {
  if (!oldId || !newId || oldId === newId) {
    return getCurrentUser(database)
  }

  const usersCollection = database.collections.get('users')
  const categoriesCollection = database.collections.get('categories')
  const eventLogsCollection = database.collections.get('event_logs')
  const goalsCollection = database.collections.get('goals')
  const questionnaireResponsesCollection = database.collections.get('questionnaire_responses')

  return await database.write(async () => {
    const oldUser = await usersCollection.find(oldId)

    // Create new user with the same data but force the id to be newId
    const newUser = await usersCollection.create((u) => {
      // Force new ID (WatermelonDB private raw field)
      // eslint-disable-next-line no-underscore-dangle
      u._raw.id = newId
      u.username = oldUser.username || ''
      u.email = oldUser.email || ''
      u.password = oldUser.password || ''
      u.createdAt = oldUser.createdAt || Date.now()
      u.firstName = oldUser.firstName || ''
      u.lastName = oldUser.lastName || ''
      u.sundayWeekStart = !!oldUser.sundayWeekStart
      u.serverUrl = oldUser.serverUrl || ''
      u.encryptionKey = oldUser.encryptionKey || ''
      u.syncFrequency = oldUser.syncFrequency || 'Never'
    })

    // Update all foreign keys referencing the user
    const [categories, eventLogs, goals, qrs] = await Promise.all([
      categoriesCollection.query(Q.where('user_id', oldId)).fetch(),
      eventLogsCollection.query(Q.where('user_id', oldId)).fetch(),
      goalsCollection.query(Q.where('user_id', oldId)).fetch(),
      questionnaireResponsesCollection.query(Q.where('user_id', oldId)).fetch(),
    ])

    const ops = []

    for (const rec of categories) {
      ops.push(rec.prepareUpdate((r) => {
        // eslint-disable-next-line no-underscore-dangle
        r._raw.user_id = newId
      }))
    }
    for (const rec of eventLogs) {
      ops.push(rec.prepareUpdate((r) => {
        // eslint-disable-next-line no-underscore-dangle
        r._raw.user_id = newId
      }))
    }
    for (const rec of goals) {
      ops.push(rec.prepareUpdate((r) => {
        // eslint-disable-next-line no-underscore-dangle
        r._raw.user_id = newId
      }))
    }
    for (const rec of qrs) {
      ops.push(rec.prepareUpdate((r) => {
        // eslint-disable-next-line no-underscore-dangle
        r._raw.user_id = newId
      }))
    }

    // Delete the old user
    ops.push(oldUser.prepareDestroyPermanently())

    await database.batch(...ops)

    // Update current user pointer in local storage
    await database.localStorage.set(CURRENT_USER_KEY, newId)

    return newUser
  })
}

