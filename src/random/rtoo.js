import * as R from 'ramda'

/**
 *  rtoo - random to offset
 *   rtoo(2, 0.432) -> 0
 *   rtoo(2, 0.5) -> 1
 *   rtoo(100, 0.43) -> 43
 */
export default
  R.curryN(
    2,
    (offsetMax, rx) =>
      R.curryN(
        2, R.compose
      )(
        Math.floor
      )(
        R.multiply(offsetMax)
      )(
        rx
      )
  )
