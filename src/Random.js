import { Alert, NativeModules } from 'react-native'

import * as R from 'ramda'

const rand = NativeModules.Sha1.rand

const rand1 =
  () =>
    R.andThen(
      R.nth(0),
      rand(1)
    )

const scramble = a => {
  const swap = (offset, pick, aa) => R.reduce(
    R.concat,
    [],
    R.juxt([
      R.compose(
        a => [a],
        R.nth(offset+pick)
      ),
      R.take(offset+pick),
      R.drop(offset+pick+1)
    ])(aa)
  )

  function shuff(rx, offset, aa) {
    const remainingLength = aa.length - offset

    if (remainingLength < 2) {
      return Promise.resolve(aa)
    }

    const pick = Math.floor(rx * remainingLength)
    const aa2 = swap(offset, pick, aa)

    return rand1().then(
      rx => shuff(rx, offset+1, aa2)
    )
  }

  return rand1().then(
    rx => shuff(rx, 0, a)
  )
}

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
