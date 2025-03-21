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
import { QueryClient, QueryClientProvider } from 'react-query'
import { LogBox, Linking } from 'react-native'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import urlParse from 'url-parse'
import Toast from 'react-native-toast-message'

import CompleteFlow from './navigation/CompleteFlow'
import * as RootNavigation from './navigation/RootNavigation'
import Store from './filters/Store'
import { en, es, pt, jp, zh, ru, ph, de } from './i18n/supportedLanguages'

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

export default App;
