import * as R from 'ramda'

import { getRandomTetKind } from '../../Random'
import { actions } from '../actions'
import { tryCatcher } from '../common'

const nextTetThunk =
  tryCatcher('nextTetThunk')(
    (dispatch, getState) =>
      R.compose(
        R.andThen(nextTet => dispatch({type: actions.setNextTet, payload: nextTet})),
        getRandomTetKind,
        R.path(['game', 'bag'])
      )(getState())
  )

const takeNextTetThunk =
  tryCatcher('takeNextTetThunk')(
    (dispatch, getState) => {
      dispatch({type: actions.useNextTet})
      dispatch({type: actions.drawActiTet})
      return nextTetThunk(dispatch, getState)
    }
  )

const handleInputThunk =
  tryCatcher('handleInputThunk')(
    (dispatch, getState) => {
      const {input} = getState()

      if (R.length(input) === 0) return

      // move to regular reducer

      const doLeftRot = R.complement(R.isNil)(R.find(R.equals('L'), input))
      const doRiteRot = R.complement(R.isNil)(R.find(R.equals('R'), input))
      const doLeft = R.complement(R.isNil)(R.find(R.equals('<'), input))
      const doRite = R.complement(R.isNil)(R.find(R.equals('>'), input))
      const doUp = R.complement(R.isNil)(R.find(R.equals('^'), input))
      const doDown = R.complement(R.isNil)(R.find(R.equals('v'), input))

      if (doLeftRot) dispatch({type: actions.leftRot})
      if (doRiteRot) dispatch({type: actions.riteRot})
      if (doLeft) dispatch({type: actions.left})
      if (doRite) dispatch({type: actions.rite})
      if (doUp) dispatch({type: actions.up})
      if (doDown) dispatch({type: actions.down})
      dispatch({type: actions.clearInput})
    }
  )

const tickGame = (dispatch, getState, checkpointIsIdle) => {
  const {game:{actiTet:{kind:actiKind}, clock, completedRows, nextTet}} = getState()

  return (
    R.isNil(nextTet)
      ? nextTetThunk(dispatch, getState)
      : Promise.resolve()
    ).then(
      () => R.isEmpty(completedRows)
        ? null
        : dispatch({type: actions.clearCompletedRows})
    ).then(
      () => R.isNil(actiKind)
        ? takeNextTetThunk(dispatch, getState)
        : () => null
    ).then(
      () => handleInputThunk(dispatch, getState)
    ).then(
      () => {
        if (clock === 0) {
          dispatch({type: actions.fall})
        }
        else {
          dispatch({type: actions.fallIfFalling})
        }
      }
    ).then(
      () => dispatch({type: actions.clockTick})
    )
}

export default tickGame
