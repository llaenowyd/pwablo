import * as R from 'ramda'

import TestUtil from '../../util'

import * as Draw from '../../../src/state/matrixReducers/draw'

const _ = '.'

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

describe('Draw.drawBlo', () => {
  it('basically works', () => {
    const cols = 10
    const rows = 10

    const state = {
      game: {
        bucket: TestUtil.makeEmptyBucket(cols, rows)
      }
    }

    const blo = {
      kind: 'T',
      pos: [1, 3],
      points: [[2, 1], [3, 1], [4, 1], [4, 2]]
    }

    const nextState = Draw.drawBlo(state)(blo)

    const emptyRow = R.repeat(_, cols)
    const expectedRows = {
      '4': [_, _, _, 'T', 'T', 'T', _, _, _, _],
      '5': [_, _, _, _, _, 'T', _, _, _, _]
    }

    expectBucket(nextState, cols, rows, expectedRows, emptyRow)
  })
})

describe('Draw.eraseBlo', () => {
  it('basically works', () => {
    const cols = 10
    const rows = 10
    const fill = 'O'

    const state = {
      game: {
        bucket: TestUtil.makeEmptyBucket(cols, rows, 'O')
      }
    }

    const blo = {
      points: [[2, 1], [3, 1], [4, 1], [4, 2]],
      pos: [1, 3]
    }

    const nextState = Draw.eraseBlo(state)(blo)

    const unchangedRow = R.repeat(fill, cols)
    const expectedRows = {
      '4': ['O', 'O', 'O', _, _, _, 'O', 'O', 'O', 'O'],
      '5': ['O', 'O', 'O', 'O', 'O', _, 'O', 'O', 'O', 'O']
    }

    expectBucket(nextState, cols, rows, expectedRows, unchangedRow)
  })
})

describe('Draw.drawActiBlo', () => {
  it('basically works', () => {
    const cols = 10
    const rows = 10

    const state = {
      game: {
        actiTet: { // tbd
          kind: 'T',
          pos: [1, 3],
          points: [[2, 1], [3, 1], [4, 1], [4, 2]]
        },
        bucket: TestUtil.makeEmptyBucket(cols, rows)
      }
    }

    const nextState = Draw.drawActiBlo(state)

    const emptyRow = R.repeat(_, cols)
    const expectedRows = {
      '4': [_, _, _, 'T', 'T', 'T', _, _, _, _],
      '5': [_, _, _, _, _, 'T', _, _, _, _]
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
          R.repeat(_),
          R.subtract(rows + TestUtil.constants.bucketBufferSize),
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
    expect(Draw.clearRows(cols, rows, [0])(bucket)).toEqual(R.repeat([2,3,4,5,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [0])(toppedBucket)).toEqual(R.repeat([2,3,4,5,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [rows-1])(bucket)).toEqual(R.repeat([1,2,3,4,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [rows-1])(toppedBucket)).toEqual(R.repeat([1,2,3,4,_,_,_,_,_,_,_], cols))
  })

  it('clears the first or last 2 rows', () => {
    expect(Draw.clearRows(cols, rows, [0, 1])(bucket)).toEqual(R.repeat([3,4,5,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [0, 1])(toppedBucket)).toEqual(R.repeat([3,4,5,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [rows-2, rows-1])(bucket)).toEqual(R.repeat([1,2,3,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [rows-2, rows-1])(toppedBucket)).toEqual(R.repeat([1,2,3,_,_,_,_,_,_,_,_], cols))
  })

  it('clears one or more rows', () => {
    expect(Draw.clearRows(cols, rows, [2])(bucket)).toEqual(R.repeat([1,2,4,5,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [2])(toppedBucket)).toEqual(R.repeat([1,2,4,5,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [2,3])(bucket)).toEqual(R.repeat([1,2,5,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [2,3])(toppedBucket)).toEqual(R.repeat([1,2,5,_,_,_,_,_,_,_,_], cols))
  })

  it('clears 2 separated rows', () => {
    expect(Draw.clearRows(cols, rows, [0,rows-1])(bucket)).toEqual(R.repeat([2,3,4,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [0,rows-1])(toppedBucket)).toEqual(R.repeat([2,3,4,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-1])(bucket)).toEqual(R.repeat([1,3,4,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-1])(toppedBucket)).toEqual(R.repeat([1,3,4,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [0,rows-2])(bucket)).toEqual(R.repeat([2,3,5,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [0,rows-2])(toppedBucket)).toEqual(R.repeat([2,3,5,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-2])(bucket)).toEqual(R.repeat([1,3,5,_,_,_,_,_,_,_,_], cols))
    expect(Draw.clearRows(cols, rows, [1,rows-2])(toppedBucket)).toEqual(R.repeat([1,3,5,_,_,_,_,_,_,_,_], cols))
  })
})
