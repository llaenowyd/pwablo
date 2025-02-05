import range from '~/range'

describe('range', () => {
  it('has correct examples', () => {
    /**
     * range
     *   range(3) -> [0, 1, 2]
     *   range(-4, 2, 2) -> [2, 0, -2]
     */

    expect(range(3)).toEqual([0, 1, 2])
    expect(range(-4, 2, 2)).toEqual([2, 0, -2])
  })

  it('requires step be positive', () => {
    expect(() => range(10, 0, -1)).toThrow(new Error('invalid step -1'))
    expect(() => range(0, 10, -1)).toThrow(new Error('invalid step -1'))
    expect(() => range(10, 0, 0)).toThrow(new Error('invalid step 0'))
  })
})
