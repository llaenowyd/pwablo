import React from 'react'

import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import { Provider } from 'react-redux'

import { getInitialState } from './initialState'
import reducer from './reducer'

const store = createStore(reducer, getInitialState(), applyMiddleware(thunk))

export default props => {
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
}
