// contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDatabase } from '@nozbe/watermelondb/hooks'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const database = useDatabase()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const users = await database.collections.get('users').query().fetch()
        if (users.length > 0) {
          setUser(users[0])
        } else {
          console.warn('No user found in database')
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [database])

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

