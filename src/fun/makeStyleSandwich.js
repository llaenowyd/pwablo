import * as R from 'ramda'

/**
 * makeStyleSandwich
 *
 * makeStyleSandwich(
 *     {protein and bread}
 *   )(
 *     {cats and pickle}
 *   )(
 *     {no-cats and dijon}
 *   )
 *   // -> pickle-dijon sandwich
 */
const makeStyleSandwich =
  R.curryN(3,
    (innate, defaults, custom) =>
      (
        variable => R.mergeLeft(innate, variable)
      )(
        R.mergeRight(
          defaults,
          R.defaultTo({}, custom)
        )
      )
  )

export default makeStyleSandwich
