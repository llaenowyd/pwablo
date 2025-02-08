import { actions } from '../actions'
import randomFill from './random-fill'
import { startTick } from './tick'

export default {
  newGame: () => (dispatch, getState) => {
    dispatch({type: actions.setupNewGame})
    startTick('game')(dispatch, getState)
  },
  pattern: () => (dispatch, getState) => {
    dispatch({type: actions.reset})
    randomFill(dispatch, getState)
    startTick('pattern')(dispatch, getState)
  },
}
