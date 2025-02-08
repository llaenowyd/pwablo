import * as R from 'ramda'

import { actions } from '../../actions'
import pattern from './pattern'
import game from './game'

/**
 * tick
 * tbd, needs work
 */
function tick(dispatch, getState) {
  const { tick: { mode, idle, interval, prevT0 } } = getState()

  if (idle) {
    return
  }

  const t0 = Date.now()
  const externalSkew = t0 - prevT0 - interval;

  const ticker = R.flip(R.prop)({ game, pattern })(mode)

  if (!ticker) {
    return
  }

  ticker(dispatch, getState)

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

  const next = idle ? null : setTimeout(() => dispatch(tick), nextInterval)

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
}

export default tick
