import * as R from 'ramda'

import { bloset } from '../../blo'
import { getRedRand, rtoo } from '../../random'
import range from '../../range'

import { actions } from '../actions'
import { alertOnce, tryCatcher } from '../common'

import tickGame from './tickGameThunk';

const tickTestPattern = (dispatch, getState, checkpointIsIdle) => {
  const { game } = getState()
  const { bucket, size } = game
  const [cols, rows] = size
  const n = cols

  const makeCheckpoint = curtail => res => checkpointIsIdle() ? curtail : res

  return R.pipeWith(
    R.andThen,
    [
      () => getRedRand()(3 * n),
      rx =>
        R.map(
          i =>
            R.applySpec({
              rowIndex: R.compose(
                rtoo(rows),
                R.nth(3 * i)
              ),
              colIndex: R.compose(
                rtoo(cols),
                R.nth(3 * i + 1)
              ),
              blo: R.compose(
                R.flip(R.nth)(bloset),
                rtoo(7),
                R.nth(3 * i + 2)
              )
            })(rx),
          range(n)
        ),
      makeCheckpoint([]),
      adjs =>
        tryCatcher('2')(
          () =>
            R.reduce(
              (bucket, {rowIndex, colIndex, blo}) =>
                R.adjust(
                  colIndex,
                  R.set(R.lensIndex(rowIndex), blo)
                )(bucket),
              bucket,
              adjs
            )
        )(),
      makeCheckpoint(null),
      bucket => R.isNil(bucket) ? null : dispatch({type: actions.setBucket, payload: bucket})
    ]
  )()
}

const makeNoop = mode => () => Promise.resolve(alertOnce(`unknown mode '${mode}'`))

const isNotRunningMode =
  mode =>
    getState =>
      R.compose(
        R.not,
        tick => R.allPass(
          [
            R.complement(R.isNil),
            R.compose(R.not, R.prop('idle')),
            R.propEq('mode', mode)
          ],
          tick
        )
      )(getState().tick)

const safetyWrap =
  (mode, ticker) =>
    (dispatch, getState, checkpointIsIdle) =>
      isNotRunningMode(mode)(getState)
        ? Promise.resolve()
        : ticker(dispatch, getState, checkpointIsIdle)

const tickerOrNoop =
    mode =>
      ticker =>
        ticker ? safetyWrap(mode, ticker) : makeNoop(mode)

function tickThunk(dispatch, getState) {
  const { tick } = getState()
  const { mode, idle, interval, prevT0 } = tick

  const checkpointIsIdle = () => getState().tick.idle

  const t0 = Date.now()
  const externalSkew = t0 - prevT0 - interval

  return (
    ticker => tickerOrNoop(mode)(ticker)(dispatch, getState, checkpointIsIdle)
  )(
    R.flip(R.prop)({
      'game': tickGame,
      'testPattern': tickTestPattern
    })(mode)
  ).then(
    () => {
      const t1 = Date.now()
      const dt = t1 - t0
      const internalSkew = dt > interval ? dt - interval : 0
      const nextInterval =
        R.when(
          R.gte(0),
          skewedNextInterval => interval + skewedNextInterval % interval
        )(
          internalSkew === 0
            ? interval - dt - externalSkew
            : dt % interval - externalSkew
        )

      if (checkpointIsIdle()) return Promise.resolve()

      const next = idle ? null : setTimeout(() => dispatch(tickThunk), nextInterval)

      dispatch({
        type: actions.setTick,
        payload: {
          mode,
          idle,
          next,
          prevT0: t0,
          skewDiagnostic: `${externalSkew}ms, ${dt}ms ${internalSkew}ms`,
          interval
        }
      })

      return Promise.resolve()
    }
  ).catch(
    e => {
      console.error(e.stack)
      alertOnce(e.message)
    }
  )
}

export default tickThunk
