import { createContext, useState, useCallback, useEffect } from 'react'
import * as R from 'ramda'

export const DisplayContext = createContext()

const addDisplayChangeListeners = onEvent => {
  window.addEventListener('resize', onEvent)
  window.addEventListener('orientationchange', onEvent)
}

const removeDisplayChangeListeners = onEvent => {
  window.removeEventListener('resize', onEvent)
  window.removeEventListener('orientationchange', onEvent)
}

const getDisplaySize = () => [
  window.innerWidth,
  window.innerHeight
]

export default ({children}) => {
  const [displayContext, setDisplayContext] = useState({
    ratio: null,
  })

  const updateDimensions = useCallback(
    R.compose(
      setDisplayContext,
      R.assoc('ratio', R.__, {}),
      R.apply(R.divide),
      getDisplaySize
    ), [setDisplayContext])

  useEffect(
    R.thunkify(R.compose(
      R.thunkify(removeDisplayChangeListeners),
      R.tap(addDisplayChangeListeners),
      R.tap(R.call)
    ))(updateDimensions),
      [updateDimensions])

  return (
    <DisplayContext.Provider value={displayContext}>
      {children}
    </DisplayContext.Provider>
  )
}
