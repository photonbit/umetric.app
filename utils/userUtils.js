// utils/userUtils.js
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

