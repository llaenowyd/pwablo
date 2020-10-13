import { NativeModules } from 'react-native'

import * as R from 'ramda'

const rand = NativeModules.Sha1.rand

import { tetset } from './tets'

export { rand }

/**
 *  Random number TO Offset
 */
export const rtoo =
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

export const rand1 =
  () =>
    R.andThen(
      R.nth(0),
      rand(1)
    )

const scramble = a =>
  (len =>
    rand(len).then(
      rx => {
        const result = R.clone(a)

        for (let offset = 0; offset < len-1; offset++) {
          const remaining = len - offset
          const pick = rtoo(remaining, rx[offset])
          const tmp = result[offset+pick]
          result[offset+pick] = result[offset]
          result[offset] = tmp
        }

        return result
      }
    )
  )(a.length)

const maybeReplenishBag =
  bag =>
    R.compose(
      R.ifElse(
        R.isEmpty,
        R.thunkify(scramble)(tetset),
        Promise.resolve
      ),
      R.defaultTo([])
    )(bag)

export const getRandomTetKind =
  R.compose(
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
