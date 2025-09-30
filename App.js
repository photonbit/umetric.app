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

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider'
import { umetricSchema } from './model/schema'
import Category from './model/Category'
import Event from './model/Event'
import EventLog from './model/EventLog'
import Goal from './model/Goal'
import LikertScale from './model/LikertScale'
import Question from './model/Question'
import QuestionLikert from './model/QuestionLikert'
import Questionnaire from './model/Questionnaire'
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
    Question,
    QuestionLikert,
    Questionnaire,
    Response,
    User,
  ],
  actionsEnabled: true,
})

const App = () => {
  useEffect(() => {
    const handleUrl = async (url) => {
      const parsedUrl = urlParse(url, true)
      const parts = parsedUrl.pathname.split('/')
      if (parts.length === 2 && parts[1].length > 0) {
        const category_id = parseInt(parts[1])
        RootNavigation.navigate('ListEvents', { category_id: category_id })
      }
    }

    Linking.addEventListener('url', ({ url }) => {
      handleUrl(url)
    })

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url)
      }
    })

    return () => {
      if (Linking) {
        Linking.removeEventListener('url')
      }
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
      <CompleteFlow />
      <Toast />
    </DatabaseProvider>
  )
}

export default App
