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
