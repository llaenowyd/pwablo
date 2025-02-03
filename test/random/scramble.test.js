import { setRand } from '../../src/random'
import scramble from '../../src/random/scramble'

describe('scramble', () => {
  it('might return the list in the original order', async () => {
    const rand = jest.fn(
      () => Promise.resolve([0, 0, 0])
    )

    setRand(rand)

    expect(await scramble([0, 1, 2, 3])).toEqual([0, 1, 2, 3])
    expect(rand).toHaveBeenCalledTimes(1)
  })

  it('might return the list in reverse order', async () => {
    const rand = jest.fn(
      () => Promise.resolve([0.9, 0.5, 0])
    )

    setRand(rand)

    expect(await scramble([0, 1, 2, 3])).toEqual([3, 2, 1, 0])
    expect(rand).toHaveBeenCalledTimes(1)
  })
})
