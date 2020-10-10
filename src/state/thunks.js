import * as R from 'ramda'

import { getNextTet } from '../Random'

import tickThunk from './tickThunk'

const makeRandomFillThunk = () => (dispatch, getState) =>
  (({bag, size}) =>
      (cells => {
        function gnt(result, bag) {
          if (result.length === cells) return Promise.resolve(result)

          return getNextTet(bag).then(
            ([np, nb]) => gnt(R.append(np, result), nb)
          )
        }

        return gnt([], bag).then(
          R.splitEvery(size[1])
        ).then(
          bucket => {
            dispatch({
              type: 'setBucket',
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
  const {mode, next, interval} = tick

  if (next) clearTimeout(next)

  dispatch({
    type: 'setTick',
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

const makeStopTickThunk = () =>
  (dispatch, getState) => {
    const {tick} = getState()
    const {next} = tick
    if (next) clearTimeout(next)

    dispatch({
      type: 'setTick',
      payload: R.mergeLeft(
        {
          next: null,
          idle: true
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
        () => makeStopTickThunk()(dispatch, getState),
        () => dispatch({type: 'reset', payload: {}}),
        () => makeStartTickThunk('game')(dispatch, getState)
      ]
    )(),
  reset: () => (dispatch, getState) =>
    makeStopTickThunk()(dispatch, getState).then(
      () => dispatch({type: 'reset', payload: {}})
    ),
  startTick: makeStartTickThunk,
  stopTick: makeStopTickThunk,
  testPattern: () => (dispatch, getState) =>
    R.pipeWith(
      R.andThen,
      [
        () => makeStopTickThunk()(dispatch, getState),
        () => makeRandomFillThunk()(dispatch, getState),
        () => makeStartTickThunk('testPattern')(dispatch, getState)
      ]
    )()
}
