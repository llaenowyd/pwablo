import { setBlueRand, setRedRand } from '../../src/random'
import blueScramble from '../../src/random/blue-scramble'
import redScramble from '../../src/random/red-scramble'

describe('blueScramble', () => {
  it('might return the list in the original order', () => {
    const rand = jest.fn(
      () => [0, 0, 0]
    )

    setBlueRand(rand)

    expect(blueScramble([0, 1, 2, 3])).toEqual([0, 1, 2, 3])
    expect(rand).toHaveBeenCalledTimes(1)
  })

  it('might return the list in reverse order', () => {
    const rand = jest.fn(
      () => [0.9, 0.5, 0]
    )

    setBlueRand(rand)

    expect(blueScramble([0, 1, 2, 3])).toEqual([3, 2, 1, 0])
    expect(rand).toHaveBeenCalledTimes(1)
  })
})

describe('redScramble', () => {
  it('might return the list in the original order', async () => {
    const rand = jest.fn(
      () => Promise.resolve([0, 0, 0])
    )

    setRedRand(rand)

    expect(await redScramble([0, 1, 2, 3])).toEqual([0, 1, 2, 3])
    expect(rand).toHaveBeenCalledTimes(1)
  })

  it('might return the list in reverse order', async () => {
    const rand = jest.fn(
      () => Promise.resolve([0.9, 0.5, 0])
    )

    setRedRand(rand)

    expect(await redScramble([0, 1, 2, 3])).toEqual([3, 2, 1, 0])
    expect(rand).toHaveBeenCalledTimes(1)
  })
})
