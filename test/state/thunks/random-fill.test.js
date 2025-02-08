import randomFill from '~/state/thunks/random-fill'

import * as R from 'ramda'

import { bloset, numBlos } from '~/blo'
import { setRand } from '~/random'
import { actions } from '~/state'

describe('randomFill', () => {
  const numCols = 5
  const numRows = numBlos

  let state = {
    game: {
      bag: [],
      size: [numCols, numRows],
    },
    size: [numCols, numRows]
  }

  const getState = jest.fn(() => state)

  const rand = jest.fn(() => R.repeat(0, numBlos - 1))
  setRand(rand)
  
  const dispatch = jest.fn(
    (action) => {
      const { type, payload } = action
      expect(type).toEqual(actions.setBucket)
      state = R.set(R.lensPath(['game', 'bucket']), payload, state)
    }
  )

  it('sets a new bucket with random blos', () => {
    randomFill(dispatch, getState)

    const expectedBucket = R.repeat(bloset, numCols)

    expect(state.game.bucket).toEqual(expectedBucket)
    expect(getState).toHaveBeenCalledTimes(1)
    expect(rand).toHaveBeenCalledTimes(numCols)
    expect(rand).toHaveBeenCalledWith(numBlos - 1)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})
