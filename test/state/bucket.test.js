import * as Bucket from '~/state/bucket'

import TestUtil from '../util'

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
        bucket: TestUtil.makeEmptyBucket(cols, rows),
        actiBlo: { points: [[0,0]], pos: [0,0] },
        completedRows: []
      }
    }

    let nextState = Bucket.completeRows(state)

    expect(nextState).toEqual(state)

    for (let i = 1; i < cols; i++) {
      state.game.bucket[i][0] = 'T'
    }

    drawPoints(state.game.bucket, state.game.actiBlo.points, state.game.actiBlo.pos, 'I')

    nextState = Bucket.completeRows(state)

    expect(nextState.game.actiBlo).toEqual(state.game.actiBlo)
    expect(nextState.game.bucket).toEqual(state.game.bucket)
    expect(nextState.game.completedRows).toEqual([0])
  })
})
