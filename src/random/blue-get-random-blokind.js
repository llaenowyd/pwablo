import * as R from 'ramda'

import { bloset } from '../blo'

import blueScramble from './blue-scramble'

const maybeReplenishBag =
  bag =>
    R.compose(
      R.ifElse(
        R.isEmpty,
        R.thunkify(blueScramble)(bloset),
        R.identity
      ),
      R.defaultTo([])
    )(bag)

/**
 * getRandomBlokind - return the next blo from a bloset bag, or a new bag if empty
 */
export default R.compose(
    R.converge(
      R.pair,
      [
        R.head,
        R.tail
      ]
    ),
    maybeReplenishBag
  )
