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
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LogBox } from 'react-native'
import * as Sentry from 'sentry-expo'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'

import CompleteFlow from './navigation/CompleteFlow'
import Store from './filters/Store'
import { en, es, pt, jp, zh, ru, ph, de  } from './i18n/supportedLanguages'


Sentry.init({
  dsn: 'https://e7fa608dd74142ce8a1817f4ea79ad37@o556434.ingest.sentry.io/5691192',
  enableInExpoDevelopment: true,
  debug: true
})

i18n.fallbacks = true
i18n.translations = { en, es, pt, jp, zh, ru, ph, de }
i18n.locale = Localization.locale

LogBox.ignoreLogs(['Setting a timer'])

const App = () => {
  const queryClient = new QueryClient()

  return (
      <QueryClientProvider client={queryClient}>
        <Store>
            <CompleteFlow/>
        </Store>
      </QueryClientProvider>
  )
}

export default Sentry.Native.wrap(App)
