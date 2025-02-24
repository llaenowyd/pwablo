import scramble from '~/random/scramble'

import { setRand } from '~/random'

describe('scramble', () => {
  it('might return the list in the original order', () => {
    const rand = jest.fn(
      () => [0, 0, 0]
    )

    setRand(rand)

    expect(scramble([0, 1, 2, 3])).toEqual([0, 1, 2, 3])
    expect(rand).toHaveBeenCalledTimes(1)
  })

  it('might return the list in reverse order', () => {
    const rand = jest.fn(
      () => [0.9, 0.5, 0]
    )

    setRand(rand)

    expect(scramble([0, 1, 2, 3])).toEqual([3, 2, 1, 0])
    expect(rand).toHaveBeenCalledTimes(1)
  })
})
