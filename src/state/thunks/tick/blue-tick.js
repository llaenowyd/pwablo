import * as R from 'ramda'

import { actions } from '../../actions'
import bluePattern from './blue-pattern'
import blueGame from './blue-game'

/**
 * blueTick
 * tbd, needs work
 */
function blueTick(dispatch, getState) {
  const { tick } = getState()
  const { mode, idle, interval, prevT0 } = tick

  if (idle) {
    return
  }

  const t0 = Date.now()
  const externalSkew = t0 - prevT0 - interval;

  const ticker = R.flip(R.prop)({
    'game': blueGame,
    'pattern': bluePattern
  })(mode)

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

  const next = idle ? null : setTimeout(() => dispatch(blueTick), nextInterval)

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

export default blueTick
