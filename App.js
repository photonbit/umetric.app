import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { LogBox } from 'react-native'
import * as Sentry from 'sentry-expo'

import CompleteFlow from './navigation/CompleteFlow'
import Store from './filters/Store'

Sentry.init({
  dsn: 'https://e7fa608dd74142ce8a1817f4ea79ad37@o556434.ingest.sentry.io/5691192',
  enableInExpoDevelopment: true,
  debug: true
})

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
