import * as R from 'ramda'

import * as TestUtil from '../../util'

import * as Draw from '../../../src/state/matrixReducers/draw'

const expectBucket =
  (state, cols, rows, expectedRows, unchangedRow) => {
    const bucket = state.game.bucket

    expect(bucket.length).toEqual(cols)
    for (let i = 0; i < cols; i++) {
      expect(bucket[i].length).toEqual(rows)
    }

    const transBucket = R.transpose(bucket)
    for (let i = 0; i < rows; i++) {
      const expectedRow = expectedRows[i]

      if (expectedRow) expect(transBucket[i]).toEqual(expectedRow)
      else expect(transBucket[i]).toEqual(unchangedRow)
    }
  }

describe('Draw.drawTet', () => {
  it('basically works', () => {
    const cols = 10
    const rows = 10

    const state = {
      game: {
        bucket: TestUtil.makeEmptyBucket(cols, rows)
      }
    }

    const tet = {
      kind: 'T',
      pos: [1, 3],
      points: [[2, 1], [3, 1], [4, 1], [4, 2]]
    }

    const nextState = Draw.drawTet(state)(tet)

    const emptyRow = R.repeat(0, cols)
    const expectedRows = {
      '4': [0, 0, 0, 'T', 'T', 'T', 0, 0, 0, 0],
      '5': [0, 0, 0, 0, 0, 'T', 0, 0, 0, 0]
    }

    expectBucket(nextState, cols, rows, expectedRows, emptyRow)
  })
})

describe('Draw.eraseTet', () => {
  it('basically works', () => {
    const cols = 10
    const rows = 10
    const fill = 'O'

    const state = {
      game: {
        bucket: TestUtil.makeEmptyBucket(cols, rows, 'O')
      }
    }

    const tet = {
      points: [[2, 1], [3, 1], [4, 1], [4, 2]],
      pos: [1, 3]
    }

    const nextState = Draw.eraseTet(state)(tet)

    const unchangedRow = R.repeat(fill, cols)
    const expectedRows = {
      '4': ['O', 'O', 'O', 0, 0, 0, 'O', 'O', 'O', 'O'],
      '5': ['O', 'O', 'O', 'O', 'O', 0, 'O', 'O', 'O', 'O']
    }

    expectBucket(nextState, cols, rows, expectedRows, unchangedRow)
  })
})

describe('Draw.drawActiTet', () => {
  it('basically works', () => {
    const cols = 10
    const rows = 10

    const state = {
      game: {
        actiTet: {
          kind: 'T',
          pos: [1, 3],
          points: [[2, 1], [3, 1], [4, 1], [4, 2]]
        },
        bucket: TestUtil.makeEmptyBucket(cols, rows)
      }
    }

    const nextState = Draw.drawActiTet(state)

    const emptyRow = R.repeat(0, cols)
    const expectedRows = {
      '4': [0, 0, 0, 'T', 'T', 'T', 0, 0, 0, 0],
      '5': [0, 0, 0, 0, 0, 'T', 0, 0, 0, 0]
    }

    expectBucket(nextState, cols, rows, expectedRows, emptyRow)
  })
})

describe('Draw.clearRows', () => {
  const cols = 5
  const rows = 5

  const topOffBucket =
    R.map(
      R.chain(
        R.flip(R.concat),
        R.compose(
          R.repeat(0),
          R.subtract(rows+6),
          R.length
        )
      )
    )

  const bucket = R.repeat([1, 2, 3, 4, 5], cols)
  const toppedBucket = topOffBucket(bucket)

  it('returns `bucket` unmodified when `rowsToClear` is empty', () => {
    expect(Draw.clearRows(cols, rows, [])(bucket)).toEqual(bucket)
  })

  it('clears the first or last row', () => {
    expect(Draw.clearRows(cols, rows, [0])(bucket)).toEqual(R.repeat([2,3,4,5,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [0])(toppedBucket)).toEqual(R.repeat([2,3,4,5,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [rows-1])(bucket)).toEqual(R.repeat([1,2,3,4,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [rows-1])(toppedBucket)).toEqual(R.repeat([1,2,3,4,0,0,0,0,0,0,0], cols))
  })

  it('clears the first or last 2 rows', () => {
    expect(Draw.clearRows(cols, rows, [0, 1])(bucket)).toEqual(R.repeat([3,4,5,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [0, 1])(toppedBucket)).toEqual(R.repeat([3,4,5,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [rows-2, rows-1])(bucket)).toEqual(R.repeat([1,2,3,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [rows-2, rows-1])(toppedBucket)).toEqual(R.repeat([1,2,3,0,0,0,0,0,0,0,0], cols))
  })

  it('clears one or more rows', () => {
    expect(Draw.clearRows(cols, rows, [2])(bucket)).toEqual(R.repeat([1,2,4,5,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [2])(toppedBucket)).toEqual(R.repeat([1,2,4,5,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [2,3])(bucket)).toEqual(R.repeat([1,2,5,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [2,3])(toppedBucket)).toEqual(R.repeat([1,2,5,0,0,0,0,0,0,0,0], cols))
  })

  it('clears 2 separated rows', () => {
    expect(Draw.clearRows(cols, rows, [0,rows-1])(bucket)).toEqual(R.repeat([2,3,4,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [0,rows-1])(toppedBucket)).toEqual(R.repeat([2,3,4,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-1])(bucket)).toEqual(R.repeat([1,3,4,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-1])(toppedBucket)).toEqual(R.repeat([1,3,4,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [0,rows-2])(bucket)).toEqual(R.repeat([2,3,5,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [0,rows-2])(toppedBucket)).toEqual(R.repeat([2,3,5,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-2])(bucket)).toEqual(R.repeat([1,3,5,0,0,0,0,0,0,0,0], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-2])(toppedBucket)).toEqual(R.repeat([1,3,5,0,0,0,0,0,0,0,0], cols))
  })
})
