import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LogBox, Linking } from 'react-native'
import * as Sentry from 'sentry-expo'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import urlParse from 'url-parse'
import Toast from 'react-native-toast-message'


import CompleteFlow from './navigation/CompleteFlow'
import * as RootNavigation from './navigation/RootNavigation'
import Store from './filters/Store'
import { en, es, pt, jp, zh, ru, ph, de } from './i18n/supportedLanguages'

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
  const queryClient = new QueryClient();

  useEffect(() => {
    const handleUrl = async (url) => {
      const parsedUrl = urlParse(url, true)
      const parts = parsedUrl.pathname.split('/')
      if (parts.length === 2 && parts[1].length > 0) {
        const category_id = parseInt(parts[1])
        RootNavigation.navigate('ListEvents', { category_id: category_id })
      }
    };

    Linking.addEventListener('url', ({ url }) => {
      handleUrl(url)
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url)
      }
    });

    return () => {
      Linking.removeEventListener('url')
    };
  }, []);

  return (
      <QueryClientProvider client={queryClient}>
        <Store>
            <CompleteFlow/>
            <Toast />
        </Store>
      </QueryClientProvider>
  )
}

export default Sentry.Native.wrap(App)
