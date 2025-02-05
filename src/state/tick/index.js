import * as R from 'ramda'

import { actions } from '../actions'
import { alertOnce } from '../common'

import redPattern from './red-pattern'
import redGame from './red-game'

const makeNoop = mode => () => Promise.resolve(alertOnce(`unknown mode '${mode}'`))

const tickerOrNoop =
    mode =>
      ticker =>
        ticker ?? makeNoop(mode)

function tickThunk(dispatch, getState) {
  const { tick } = getState()
  const { mode, idle, interval, prevT0 } = tick

  const t0 = Date.now()
  const externalSkew = t0 - prevT0 - interval

  return (
    ticker => tickerOrNoop(mode)(ticker)(dispatch, getState)
  )(
    R.flip(R.prop)({
      'game': redGame,
      'pattern': redPattern
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
