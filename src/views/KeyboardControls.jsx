import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import * as R from 'ramda'

import { actions } from '../state'

const keyCodeActionTypeTable = R.compose(
  R.fromPairs,
  R.chain(
    R.compose(
      R.apply(R.xprod),
      R.adjust(1, R.of(Array))
    )
  )
)([
  [['Space', 'KeyS', 'ArrowDown'], actions.inpD],
  [['KeyA', 'ArrowLeft'], actions.inpL],
  [['KeyQ', 'ArrowUp'], actions.inpLR],
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
      R.flip(R.prop)(keyCodeActionTypeTable),
      R.prop('code')
    ),
    [dispatch]
  )

  useEffect(
    R.thunkify(
      R.compose(
        R.thunkify(R.curry(window.removeEventListener)('keydown')),
        R.tap(R.curry(window.addEventListener)('keydown'))
      )
    )(keyDownHandler),
     [keyDownHandler]
  )

  return null
}
