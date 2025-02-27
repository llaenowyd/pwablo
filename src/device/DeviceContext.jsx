import { createContext, useState, useCallback, useEffect } from 'react'
import * as R from 'ramda'

const getDisplaySize = () => [
  window.innerWidth,
  window.innerHeight
]

const hasTouchscreen = () => 'ontouchstart' in window

const addDisplayChangeListeners = onEvent => {
  window.addEventListener('resize', onEvent)
  window.addEventListener('orientationchange', onEvent)
}

const removeDisplayChangeListeners = onEvent => {
  window.removeEventListener('resize', onEvent)
  window.removeEventListener('orientationchange', onEvent)
}

export const DeviceContext = createContext()

/**
 * DeviceProvider
 */
export default ({children}) => {
  const [deviceContext, setDeviceContext] = useState({
    displayRatio: null,
    hasTouchscreen: null,
  })

  const update = useCallback(
    R.compose(
      setDeviceContext,
      R.fromPairs,
      R.zip(['displayRatio', 'hasTouchscreen']),
      R.adjust(0, R.apply(R.divide)),
      R.juxt([getDisplaySize, hasTouchscreen])
    ), [setDeviceContext])

  useEffect(
    R.thunkify(R.compose(
      R.thunkify(removeDisplayChangeListeners),
      R.tap(addDisplayChangeListeners),
      R.tap(R.call)
    ))(update),
      [update])

  return (
    <DeviceContext.Provider value={deviceContext}>
      {children}
    </DeviceContext.Provider>
  )
}
