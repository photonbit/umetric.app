/*
    uMetric.app
    Copyright (C) 2021  Daniel Moreno Medina

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { LogBox, Linking } from 'react-native'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import urlParse from 'url-parse'
import Toast from 'react-native-toast-message'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import CompleteFlow from './navigation/CompleteFlow'
import * as RootNavigation from './navigation/RootNavigation'
import { en, es, pt, jp, zh, ru, ph, de } from './i18n/supportedLanguages'
import { UserProvider } from './contexts/UserContext'

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider'
import { umetricSchema } from './model/schema'
import Category from './model/Category'
import Event from './model/Event'
import EventLog from './model/EventLog'
import Goal from './model/Goal'
import LikertScale from './model/LikertScale'
import LikertScaleTranslation from './model/LikertScaleTranslation'
import Question from './model/Question'
import QuestionLikert from './model/QuestionLikert'
import QuestionTranslation from './model/QuestionTranslation'
import Questionnaire from './model/Questionnaire'
import QuestionnaireResponse from './model/QuestionnaireResponse'
import QuestionnaireTranslation from './model/QuestionnaireTranslation'
import Response from './model/Response'
import User from './model/User'
import { setGenerator } from '@nozbe/watermelondb/utils/common/randomId'
import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations'

i18n.fallbacks = true
i18n.translations = { en, es, pt, jp, zh, ru, ph, de }
i18n.locale = Localization.getLocales()[0].languageCode

LogBox.ignoreLogs(['Setting a timer'])

setGenerator(() => uuidv4())
const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'users',
          columns: [
            { name: 'server_url', type: 'string', isOptional: true },
            { name: 'encryption_key', type: 'string', isOptional: true },
            { name: 'sync_frequency', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
  ],
})
const adapter = new SQLiteAdapter({ schema: umetricSchema, migrations })
const database = new Database({
  adapter,
  modelClasses: [
    Category,
    Event,
    EventLog,
    Goal,
    LikertScale,
    LikertScaleTranslation,
    Question,
    QuestionLikert,
    QuestionTranslation,
    Questionnaire,
    QuestionnaireResponse,
    QuestionnaireTranslation,
    Response,
    User,
  ],
  actionsEnabled: true,
})

const App = () => {
  useEffect(() => {
    const handleUrl = async (url) => {
      console.log('Deep link received:', url)
      try {
        const parsedUrl = urlParse(url, true)
        console.log('Parsed URL:', parsedUrl)
        
        // Handle different URL formats
        let category_id = null
        
        // Format 1: umetric://category/123
        if (parsedUrl.pathname) {
          const parts = parsedUrl.pathname.split('/').filter(part => part.length > 0)
          console.log('URL parts:', parts)
          
          if (parts.length >= 1) {
            category_id = parseInt(parts[0])
            console.log('Category ID from pathname:', category_id)
          }
        }
        
        // Format 2: umetric://?category=123 (query params)
        if (!category_id && parsedUrl.query.category) {
          category_id = parseInt(parsedUrl.query.category)
          console.log('Category ID from query:', category_id)
        }
        
        // Format 3: umetric://123 (direct scheme)
        if (!category_id && parsedUrl.hostname) {
          category_id = parseInt(parsedUrl.hostname)
          console.log('Category ID from hostname:', category_id)
        }
        
        if (category_id && !isNaN(category_id)) {
          console.log('Navigating to ListEvents with category_id:', category_id)
          RootNavigation.navigate('ListEvents', { category_id: category_id })
        } else {
          console.log('No valid category_id found in URL')
        }
      } catch (error) {
        console.error('Error handling deep link:', error)
      }
    }

    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('URL event received:', url)
      handleUrl(url)
    })

    Linking.getInitialURL().then((url) => {
      console.log('Initial URL:', url)
      if (url) {
        handleUrl(url)
      }
    })

    return () => {
      subscription?.remove()
    }
  }, [])

  // Ensure a user exists at app start
  useEffect(() => {
    const ensureUser = async () => {
      const users = await database.collections.get('users').query().fetch()
      if (users.length === 0) {
        await database.write(async () => {
          await database.get('users').create((u) => {
            u.username = ''
            u.email = ''
            u.password = ''
            u.createdAt = Date.now()
            u.firstName = ''
            u.lastName = ''
            u.sundayWeekStart = false
            u.serverUrl = ''
            u.encryptionKey = ''
            u.syncFrequency = 'Never'
          })
        })
      }
    }
    ensureUser()
  }, [])

  return (
    <DatabaseProvider database={database}>
      <UserProvider>
        <CompleteFlow />
        <Toast />
      </UserProvider>
    </DatabaseProvider>
  )
}

export default App
