import getRandomBlokind from '~/blo/get-random-blokind'

import * as R from 'ramda'

import { numBlos } from '~/blo'
import { setRand } from '~/random'

describe('getRandomBlokind', () => {
  it('might appear to be non-random', () => {
    const rand = jest.fn(
      () => R.repeat(0, numBlos-1)
    )

    setRand(rand)

    let state = { bag: [] }

    const harness = () => {
      const [nextBlo, nextBag] = getRandomBlokind(state.bag)
      state = R.set(R.lensProp('bag'), nextBag, state)
      return nextBlo
    }

    const numBags = 5
    const result = R.repeat(0, numBlos * numBags)

    for (let i = 0; i < numBlos * numBags; i++) {
      result[i] = harness()
    }

    expect(R.count(R.equals('I'), result)).toBe(numBags)
    expect(R.count(R.equals('J'), result)).toBe(numBags)
    expect(R.count(R.equals('L'), result)).toBe(numBags)
    expect(R.count(R.equals('O'), result)).toBe(numBags)
    expect(R.count(R.equals('S'), result)).toBe(numBags)
    expect(R.count(R.equals('T'), result)).toBe(numBags)
    expect(R.count(R.equals('Z'), result)).toBe(numBags)

    const bags = R.splitEvery(numBlos, result)

    for (let i = 0; i < numBags; i++) {
      expect(bags[i]).toEqual(['I', 'J', 'L', 'O', 'S', 'T', 'Z'])
    }

    expect(rand).toHaveBeenCalledTimes(numBags)
  })
})
