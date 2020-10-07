import * as R from 'ramda'

import { getNextPiece, rand } from '../Random'

import tickThunk from './tickThunk'

const makeRandomFillThunk = () => (dispatch, getState) =>
  (({bag, size}) =>
      (cells => {
        function gnp(result, bag) {
          if (result.length === cells) return Promise.resolve(result)

          return getNextPiece(bag).then(
            ([np, nb]) => gnp(R.append(np, result), nb)
          )
        }

        return gnp([], bag).then(
          R.splitEvery(size[0])
        ).then(
          bucket => {
            dispatch({
              type: 'setBucket',
              payload: bucket
            })
          }
        )
      })(size[0]*size[1])
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
  doTestPattern: () => (dispatch, getState) =>
    makeStopTickThunk()(dispatch, getState).then(
      () => makeRandomFillThunk()(dispatch, getState)
    ).then(
      () => makeStartTickThunk('testPattern')(dispatch, getState)
    ),
  startTick: makeStartTickThunk,
  stopTick: makeStopTickThunk
}
