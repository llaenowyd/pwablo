import { useCallback, useEffect, useState } from 'react'
import * as R from 'ramda'

const getIsVisible = () => !document.hidden

/**
 * useVisibility
 */
export default () => {
  const [isVisible, setIsVisible] = useState(getIsVisible)

  const update = useCallback(R.compose(setIsVisible, getIsVisible), [setIsVisible])

  useEffect(
    R.thunkify(
      R.compose(
        R.thunkify(R.curry(document.removeEventListener)('visibilitychange')),
        R.tap(R.curry(document.addEventListener)('visibilitychange')),
        R.tap(R.call)
      )
    )(update),
     [update]
  )

  return isVisible
}
