
import * as Bucket from '../src/bucket'
import * as Pokedraw from '../src/state/matrixReducers/pokedraw';

const makeEmptyBucket = (cols, rows) => {
  const result = []

  for (let i = 0; i < cols; i++) {
    result.push([])
    const ri = result.length - 1

    for (let j = 0; j < rows; j++) {
      result[ri].push(0)
    }
  }

  return result
}

const drawPoints = (bucket, points, pos, kind) => {
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const [pi, pj] = [point[0] + pos[0], point[1] + pos[1]]
    bucket[pi][pj] = kind
  }
  return bucket
}

describe('Bucket.completeRows', () => {
  const cols = 10
  const rows = 20

  it('basically works', () => {
    const state = {
      game: {
        bucket: makeEmptyBucket(cols, rows),
        actiTet: { points: [[0,0]], pos: [0,0] },
        completedRows: []
      }
    }

    let nextState = Bucket.completeRows(state)

    expect(nextState).toEqual(state)

    for (let i = 1; i < cols; i++) {
      state.game.bucket[i][0] = 'T'
    }

    drawPoints(state.game.bucket, state.game.actiTet.points, state.game.actiTet.pos, 'I')

    nextState = Bucket.completeRows(state)

    expect(nextState.game.actiTet).toEqual(state.game.actiTet)
    expect(nextState.game.bucket).toEqual(state.game.bucket)
    expect(nextState.game.completedRows).toEqual([0])
  })
})

describe('Bucket.groupCompletedRows', () => {
  it('basically works', () => {
    const completedRows = [0, 1, 3, 4, 5, 8, 9, 10, 12]
    const expectedResult = [[2, [0, 1]], [3, [3, 5]], [3, [8, 10]], [1, [12, 12]]]

    expect(Bucket.groupCompletedRows(completedRows)).toEqual(expectedResult)
  })
})

describe('Bucket.digestCompletedGroups', () => {
  it('basically works', () => {
    const endRow = 14
    const completedGroups = [[2, [0, 1]], [3, [3, 5]], [3, [8, 10]], [1, [12, 12]]]
    const expectedResult = [[2, [0, 3]], [5, [3, 8]], [8, [8, 12]], [9, [12, 14]]]

    expect(Bucket.digestCompletedGroups(endRow)(completedGroups)).toEqual(expectedResult)
  })
})

describe.skip('Bucket.getFallRanges', () => {
  it('returns empty list when no completed rows', () => {
    expect(Bucket.getFallRanges(23)([])).toEqual([])
  })

  it('returns rows subsequent to a single completed row', () => {
    expect(Bucket.getFallRanges(23)([0])).toEqual([[1, [0, 23]]])
    expect(Bucket.getFallRanges(23)([1])).toEqual([[1, [1, 23]]])
    expect(Bucket.getFallRanges(23)([19])).toEqual([[1, [19, 23]]])
    expect(Bucket.getFallRanges(23)([22])).toEqual([[1, [22, 23]]])
  })

  it('returns rows subsequent to a single group of completed rows', () => {
    expect(Bucket.getFallRanges(23)([0, 1])).toEqual([[2, [0, 23]]])
    expect(Bucket.getFallRanges(23)([1, 2])).toEqual([[2, [1, 23]]])
    expect(Bucket.getFallRanges(23)([19, 20, 21])).toEqual([[3, [19, 23]]])
    expect(Bucket.getFallRanges(23)([19, 20, 21, 22])).toEqual([[4, [19, 23]]])
    expect(Bucket.getFallRanges(23)([22, 23, 24, 25])).toEqual([[4, [22, 23]]])
  })

  it('works for some groupings', () => {
    expect(Bucket.getFallRanges(23)([0, 5])).toEqual([[1, [0, 5]], [2, [5, 23]]])
    expect(Bucket.getFallRanges(23)([2, 5])).toEqual([[1, [2, 5]], [2, [5, 23]]])
    expect(Bucket.getFallRanges(23)([2, 5, 7])).toEqual([[1, [2, 5]], [2, [5, 23]]])
    expect(Bucket.getFallRanges(23)([2, 5, 7])).toEqual([[1, [2, 5]], [2, [5, 7]], [3, [7, 23]]])
    expect(Bucket.getFallRanges(23)([2, 5, 6, 7])).toEqual([[1, [2, 5]], [4, [5, 23]]])

  })
})

describe.skip('Bucket.clearRows', () => {
  // (cols, rows, rowsToClear) -> bucket -> bucket
})
