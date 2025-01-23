import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import * as R from 'ramda'

import { actions } from '../state/actions'

const keyCodeActionTypeTable = R.compose(
  R.fromPairs,
  R.chain(
    R.compose(
      R.apply(R.xprod),
      R.over(
        R.lensIndex(1),
        R.of(Array)
      )
    )
  )
)([
  [['Space', 'KeyS', 'ArrowDown'], actions.inpD],
  [['KeyA', 'ArrowLeft'], actions.inpL],
  [['KeyQ'], actions.inpLR],
  [['KeyD', 'ArrowRight'], actions.inpR],
  [['KeyE'], actions.inpRR],
])

const makeDispatch = dispatch => actionType => { dispatch({type: actionType}) }

export default () => {
  const dispatch = useDispatch()

  const keyDownHandler = useCallback(
    R.compose(
      R.always(),
      R.when(
        R.isNotNil,
        makeDispatch(dispatch)
      ),
      R.tap(actionType => { console.log(actionType) }),
      R.flip(R.prop)(keyCodeActionTypeTable),
      R.prop('code')
    ),
    [dispatch]
  )

  useEffect(
    () => {
      addEventListener('keydown', keyDownHandler)

      return () => {
        removeEventListener('keydown', keyDownHandler)
      }
    },
    [keyDownHandler]
  )

  return null
}
