import blueRandomFill from '~/state/thunks/blue-random-fill'
import redRandomFill from '~/state/thunks/red-random-fill'

import * as R from 'ramda'

import { bloset, numBlos } from '~/blo'
import { setBlueRand, setRedRand } from '~/random'
import { actions } from '~/state'

describe('blueRandomFill', () => {
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
  setBlueRand(rand)
  
  const dispatch = jest.fn(
    (action) => {
      const { type, payload } = action
      expect(type).toEqual(actions.setBucket)
      state = R.set(R.lensPath(['game', 'bucket']), payload, state)
    }
  )

  it('sets a new bucket with random blos', () => {
    blueRandomFill(dispatch, getState)

    const expectedBucket = R.repeat(bloset, numCols)

    expect(state.game.bucket).toEqual(expectedBucket)
    expect(getState).toHaveBeenCalledTimes(1)
    expect(rand).toHaveBeenCalledTimes(numCols)
    expect(rand).toHaveBeenCalledWith(numBlos - 1)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})

describe('redRandomFill', () => {
  const numCols = 5
  const numRows = numBlos

  let state = {
    game: {
      bag: [],
      size: [numCols, numRows],
    },
  }

  const getState = jest.fn(() => state)

  const rand = jest.fn(() => Promise.resolve(R.repeat(0, numBlos - 1)))
  setRedRand(rand)

  const dispatch = jest.fn(
    (action) => {
      const { type, payload } = action
      expect(type).toEqual(actions.setBucket)
      state = R.set(R.lensPath(['game', 'bucket']), payload, state)
    }
  )

  it('sets a new bucket with random blos', async () => {
    await redRandomFill(dispatch, getState)

    const expectedBucket = R.repeat(bloset, numCols)

    expect(state.game.bucket).toEqual(expectedBucket)
    expect(getState).toHaveBeenCalledTimes(1)
    expect(rand).toHaveBeenCalledTimes(numCols)
    expect(rand).toHaveBeenCalledWith(numBlos - 1)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})
