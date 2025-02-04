import * as R from 'ramda'

import { MT, numBlos } from '../../../src/blo'
import { setBlueRand, setRedRand } from '../../../src/random'
import { actions } from '../../../src/state'
import bluePattern from '../../../src/state/tick/blue-pattern'
import redPattern from '../../../src/state/tick/red-pattern'

describe('redPattern', () => {
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
  const redRand = jest.fn(
    () => Promise.resolve([
      0, 0, 0,
      1/rows, 1/cols, 1/numBlos,
      2/rows, 2/cols, 2/numBlos,
    ])
  )

  setRedRand(redRand)

  it('uses rand to set values in bucket', async () => {
    await redPattern(dispatch, getState)

    expect(state.game.bucket).toEqual([
      ['I', MT, MT, MT],
      [MT, 'J', MT, MT],
      [MT, MT, 'L', MT],
    ])
    expect(redRand).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(getState).toHaveBeenCalledTimes(1)
  })
})

describe('bluePattern', () => {
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
  const blueRand = jest.fn(
    () => [
      0, 0, 0,
      1/rows, 1/cols, 1/numBlos,
      2/rows, 2/cols, 2/numBlos,
    ]
  )

  setBlueRand(blueRand)

  it('uses rand to set values in bucket', () => {
    bluePattern(dispatch, getState)

    expect(state.game.bucket).toEqual([
      ['I', MT, MT, MT],
      [MT, 'J', MT, MT],
      [MT, MT, 'L', MT],
    ])
    expect(blueRand).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(getState).toHaveBeenCalledTimes(1)
  })
})
