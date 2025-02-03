import rtoo from '../../src/random/rtoo'

describe('range', () => {
  it('has correct examples', () => {
    /**
     *  rtoo - random to offset
     *   rtoo(2, 0.432) -> 0
     *   rtoo(2, 0.5) -> 1
     *   rtoo(100, 0.43) -> 43
     */

    expect(rtoo(2, 0.432)).toEqual(0)
    expect(rtoo(2, 0.5)).toEqual(1)
    expect(rtoo(100, 0.43)).toEqual(43)
  })
})
