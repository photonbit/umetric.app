import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query';
import { LogBox } from 'react-native';


import CompleteFlow from './navigation/CompleteFlow'
import Store from './filters/Store'

LogBox.ignoreLogs(['Setting a timer']);


export default function App() {
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        <Store>
            <CompleteFlow/>
        </Store>
      </QueryClientProvider>
    )
}
