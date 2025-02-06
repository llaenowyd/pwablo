import * as R from 'ramda'

import { actions } from '../actions'

import redRandomFill from './red-random-fill'
import { startTick } from './tick'

export default {
  newGame: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => Promise.resolve(dispatch({type: actions.setupNewGame})),
        () => startTick('game')(dispatch, getState)
      ]
    )(),
  pattern: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => {
          dispatch({type: actions.reset})
          return Promise.resolve()
        },
        () => redRandomFill(dispatch, getState),
        () => startTick('pattern')(dispatch, getState)
      ]
    )()
}
