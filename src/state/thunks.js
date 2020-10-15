import * as R from 'ramda'

import { getRandomTetKind } from '../Random'

import { actions } from './actions'
import tickThunk from './tickThunk'

const makeRandomFillThunk = () => (dispatch, getState) =>
  (({bag, size}) =>
      (cells => {
        function gnt(result, bag) {
          if (result.length === cells) return Promise.resolve(result)

          return getRandomTetKind(bag).then(
            ([np, nb]) => gnt(R.append(np, result), nb)
          )
        }

        return gnt([], bag).then(
          R.splitEvery(size[1])
        ).then(
          bucket => {
            dispatch({
              type: actions.setBucket,
              payload: bucket
            })
          }
        )
      })(R.apply(R.multiply)(size))
  )(
    R.prop('game', getState())
  )

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
        () => Promise.resolve(dispatch({type: actions.reset})),
        () => makeStartTickThunk('game')(dispatch, getState)
      ]
    )(),
  startTick: makeStartTickThunk,
  testPattern: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => {
          dispatch({type: actions.reset})
          return Promise.resolve()
        },
        () => makeRandomFillThunk()(dispatch, getState),
        () => makeStartTickThunk('testPattern')(dispatch, getState)
      ]
    )()
}
