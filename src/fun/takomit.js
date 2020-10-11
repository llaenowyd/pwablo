import * as R from 'ramda'

/**
 * takomit
 *
 * takomit(['b'])(a)({ a: 1, b: 2, c: 3 })
 *   // -> [{"a": 1, "c": 3}, {"b": 2}]
 */
export const takomit =
  R.curryN(
    2,
    (lst, ob) =>
      R.chain(
        pickedProps =>
          R.compose(
            R.reverse,
            R.pair(pickedProps),
            R.omit(lst)
          ),
        R.pick(lst)
      )(ob)
  )
