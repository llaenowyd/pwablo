import * as R from 'ramda'

import { scramble } from '~/random'

import { bloset } from './bloset'

const maybeReplenishBag =
  bag =>
    R.compose(
      R.ifElse(
        R.isEmpty,
        R.thunkify(scramble)(bloset),
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
