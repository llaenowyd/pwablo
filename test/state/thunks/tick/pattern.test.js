import pattern from '~/state/thunks/tick/pattern'

import * as R from 'ramda'

import { MT, numBlos } from '~/blo'
import { setRand } from '~/random'
import { actions } from '~/state'

describe('pattern', () => {
  const cols = 3
  const rows = 4

  let state = {
    game: {
      size: [cols, rows],
      bucket: R.times(() => R.repeat(MT, rows), cols)
    },
  }

  const getState = jest.fn(() => state)

  const dispatch = jest.fn(
    (action) => {
      const { type, payload } = action
      expect(type).toEqual(actions.setBucket)
      state = R.set(R.lensPath(['game', 'bucket']), payload, state)
    }
  )

  // called for n=3*cols, triples used to pick (row, column, blo) 
  const rand = jest.fn(
    () => [
      0, 0, 0,
      1/rows, 1/cols, 1/numBlos,
      2/rows, 2/cols, 2/numBlos,
    ]
  )

  setRand(rand)

  it('uses rand to set values in bucket', () => {
    pattern(dispatch, getState)

    expect(state.game.bucket).toEqual([
      ['I', MT, MT, MT],
      [MT, 'J', MT, MT],
      [MT, MT, 'L', MT],
    ])
    expect(rand).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(getState).toHaveBeenCalledTimes(1)
  })
})
