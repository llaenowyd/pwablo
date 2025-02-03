import * as R from 'ramda'

import { bloset } from '../blo'

import scramble from './scramble'

const maybeReplenishBag =
  bag =>
    R.compose(
      R.ifElse(
        R.isEmpty,
        R.thunkify(scramble)(bloset),
        val => Promise.resolve(val)
      ),
      R.defaultTo([])
    )(bag)

/**
 * getRandomBlokind - return the next blo from a bloset bag, or a new bag if empty
 */
export default R.compose(
    R.andThen(
      R.converge(
        R.pair,
        [
          R.head,
          R.tail
        ]
      )
    ),
    maybeReplenishBag
  )
