import React from 'react'

import CompleteFlow from './navigation/CompleteFlow'
import Store from './filters/Store'

export default function App() {
    return (
        <Store>
            <CompleteFlow/>
        </Store>
    )
}
