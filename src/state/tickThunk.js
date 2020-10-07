import { Alert } from 'react-native'

import * as R from 'ramda'

import makeRange from '../fun/makeRange'
import { rand } from '../Random'

const catcher = tag => e => { throw new Error(`${tag} ${e.message}`) }
const tryCatcher = tag => f => R.tryCatch(f, catcher(tag))

const tickTestPattern = (dispatch, getState) => {
  const { game } = getState()
  const { bucket, size } = game
  const [rows, cols] = size
  const n = 20

  return rand(3 * n).then(
    rx =>
      tryCatcher('1')(
        () =>
          R.map(
            i =>
              R.applySpec({
                rowIndex: R.compose(
                  Math.floor,
                  R.multiply(rows),
                  R.nth(3 * i)
                ),
                colIndex: R.compose(
                  Math.floor,
                  R.multiply(cols),
                  R.nth(3 * i + 1)
                ),
                tet: R.compose(
                  R.flip(R.nth)(['I', 'J', 'L', 'O', 'S', 'T', 'Z']),
                  Math.floor,
                  R.multiply(7),
                  R.nth(3 * i + 2)
                )
              })(rx),
            makeRange(n)
          )
      )()
  ).then(
    adjs =>
      R.reduce(
        (bucket, {rowIndex, colIndex, tet}) =>
          R.over(
            R.lensIndex(colIndex),
            R.set(R.lensIndex(rowIndex), tet)
          )(bucket),
        bucket,
        adjs
      )
  ).then(
    bucket => dispatch({type: 'setBucket', payload: bucket})
  )
}

function tickThunk(dispatch, getState) {
  const { tick } = getState()
  const { mode, idle, interval, prevT0 } = tick

  const t0 = Date.now()
  const externalSkew = t0 - prevT0 - interval

  const noop = () => Promise.resolve()

  return (
    ticker => R.defaultTo(noop, ticker)(dispatch, getState)
  )(
    R.flip(R.prop)({
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

      const next = idle ? null : setTimeout(() => dispatch(tickThunk), nextInterval)

      dispatch({
        type: 'setTick',
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
  ).catch(
    e => Alert.alert('error', e.message)
  )
}

export default tickThunk
