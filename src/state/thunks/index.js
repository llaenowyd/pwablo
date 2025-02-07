import * as R from 'ramda'

import { actions } from '../actions'

import blueRandomFill from './blue-random-fill'
import redRandomFill from './red-random-fill'
import { blueStartTick, redStartTick } from './tick'

export default {
  blueNewGame: () => (dispatch, getState) => {
    dispatch({type: actions.setupNewGame})
    blueStartTick('game')(dispatch, getState)
  },
  bluePattern: () => (dispatch, getState) => {
    dispatch({type: actions.reset})
    blueRandomFill(dispatch, getState)
    blueStartTick('pattern')(dispatch, getState)
  },
  redNewGame: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => Promise.resolve(dispatch({type: actions.setupNewGame})),
        () => redStartTick('game')(dispatch, getState)
      ]
    )(),
  redPattern: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => {
          dispatch({type: actions.reset})
          return Promise.resolve()
        },
        () => redRandomFill(dispatch, getState),
        () => redStartTick('pattern')(dispatch, getState)
      ]
    )(),
}
