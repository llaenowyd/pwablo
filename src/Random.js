import { Alert, NativeModules } from 'react-native'

import * as R from 'ramda'

const rand = NativeModules.Sha1.rand

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
        const result = R.map(R.identity)(a)

        for (let offset = 0; offset < len-1; offset++) {
          const remaining = len - offset
          const pick = Math.floor(rx[offset] * remaining)
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
        () => scramble(['I','J','L','O','S','T','Z']),
        bag => Promise.resolve(bag)
      ),
      R.defaultTo([])
    )(bag)

export const getNextPiece =
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
