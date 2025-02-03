import * as R from 'ramda'

import { getRandomBlokind } from '../../random'
import { actions } from '../actions'
import { tryCatcher } from '../common'

const nextBloThunk =
  tryCatcher('nextBloThunk')(
    (dispatch, getState) =>
      R.compose(
        R.andThen(nextBlo => dispatch({type: actions.setNextBlo, payload: nextBlo})),
        getRandomBlokind,
        R.path(['game', 'bag'])
      )(getState())
  )

const takeNextBloThunk =
  tryCatcher('takeNextBloThunk')(
    (dispatch, getState) => {
      dispatch({type: actions.useNextBlo})
      return nextBloThunk(dispatch, getState)
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
      const doDown = R.complement(R.isNil)(R.find(R.equals('v'), input))

      if (doLeftRot) dispatch({type: actions.leftRot})
      if (doRiteRot) dispatch({type: actions.riteRot})
      if (doLeft) dispatch({type: actions.left})
      if (doRite) dispatch({type: actions.rite})
      if (doDown) dispatch({type: actions.down})
      dispatch({type: actions.clearInput})
    }
  )

const tickGame = (dispatch, getState, checkpointIsIdle) => {
  const {game:{actiBlo:{kind:actiKind}, clock, completedRows, nextBlo}} = getState()

  return (
    R.isNil(nextBlo)
      ? nextBloThunk(dispatch, getState)
      : Promise.resolve()
    ).then(
      () => R.isEmpty(completedRows)
        ? null
        : dispatch({type: actions.clearCompletedRows})
    ).then(
      () => R.isNil(actiKind)
        ? takeNextBloThunk(dispatch, getState)
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
