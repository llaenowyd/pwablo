import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import * as R from 'ramda'

import dbg from '../dbg'
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
      dbg.T('kat'),
      R.flip(R.prop)(keyCodeActionTypeTable),
      R.prop('code')
    ),
    [dispatch]
  )

  useEffect(
    R.compose(
      R.always(
        R.thunkify(removeEventListener)('keydown', keyDownHandler)
      ),
      R.thunkify(addEventListener)('keydown', keyDownHandler)
    ),
    [keyDownHandler]
  )

  return null
}
