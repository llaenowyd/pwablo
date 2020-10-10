import { NativeModules } from 'react-native'

import * as R from 'ramda'

const rand = NativeModules.Sha1.rand

import { tetset } from './tets'

// numbers Java sees as <1 can be =1 here
export const safeRange =
  R.curryN(
    2,
    (rangeLen, rx) =>
      R.compose(
        R.when(
          R.equals(rangeLen),
          R.subtract(1)
        ),
        Math.floor,
        R.multiply(rangeLen)
      )(rx)
  )

const rand1 =
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
          const pick = safeRange(remaining, rx[offset])
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
        bag => Promise.resolve(bag)
      ),
      R.defaultTo([])
    )(bag)

export const getNextTet =
  R.compose(
    R.andThen(
      R.converge(
        (x, y) => [x, y],
        [
          R.head,
          R.tail
        ]
      )
    ),
    maybeReplenishBag
  )

export { rand, rand1 }
