import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

import Reducer from './Reducer'

import { initialConfig } from '../config'

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialConfig)
  return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
  )
}

Store.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}

export const Context = createContext(initialConfig)
export default Store
