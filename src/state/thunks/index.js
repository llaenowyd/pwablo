import * as R from 'ramda'

import { actions } from '../actions'
import tickThunk from '../tick'

import redRandomFill from './red-random-fill'

const makeStartTickThunk = nextMode => (dispatch, getState) => {
  const {tick} = getState()
  const {mode, interval} = tick

  dispatch({
    type: actions.setTick,
    payload: R.mergeLeft(
      {
        mode: nextMode ?? mode,
        idle: false,
        next: setTimeout(() => dispatch(tickThunk), interval),
        prevT0: Date.now()
      },
      tick
    )
  })

  return Promise.resolve()
}

export default {
  newGame: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => Promise.resolve(dispatch({type: actions.setupNewGame})),
        () => makeStartTickThunk('game')(dispatch, getState)
      ]
    )(),
  startTick: makeStartTickThunk,
  pattern: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => {
          dispatch({type: actions.reset})
          return Promise.resolve()
        },
        () => redRandomFill(dispatch, getState),
        () => makeStartTickThunk('pattern')(dispatch, getState)
      ]
    )()
}
