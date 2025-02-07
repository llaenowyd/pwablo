import * as R from 'ramda'

import range from '~/range'

import { bloset } from './bloset'
import blueGetRandomBlokind from './blue-get-random-blokind'
import redGetRandomBlokind from './red-get-random-blokind'

const MT = '.'

const numBlos = R.length(bloset)

const offsets = {
  I: [[-1,0],[0,0],[1,0],[2,0]],
  J: [[-1,1],[-1,0],[0,0],[1,0]],
  L: [[-1,0],[0,0],[1,0],[1,1]],
  O: [[0,0],[1,0],[1,1],[0,1]],
  S: [[-1,0],[0,0],[0,1],[1,1]],
  T: [[-1,0],[0,0],[1,0],[0,1]],
  Z: [[-1,1],[0,1],[0,0],[1,0]]
}

// bloKind -> kicks
const getKicks = R.cond([
    [
      R.equals('I'),
      R.always([
          [[0, 0], [-1, 0], [2, 0], [-1, 0], [2, 0]],
          [[-1, 0], [0, 0], [0, 0], [0,1], [0,-2]],
          [[-1,1], [1,1], [-2,1], [1, 0], [-2, 0]],
          [[0,1], [0,1], [0,1], [0,-1], [0,2]]
        ])
    ],
    [
      R.equals('O'),
      R.always([
          [[0, 0]],
          [[0,-1]],
          [[-1,-1]],
          [[-1, 0]]
        ])
    ],
    [
      R.T,
      R.always([
          [[0,0], [0,0], [0,0], [0,0], [0,0]],
          [[0,0], [1,0], [1,-1], [0,2], [1,2]],
          [[0,0], [0,0], [0,0], [0,0], [0,0]],
          [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]
        ])
    ]
  ])

const makeKickers = kix => {
  const subroutine =
    (i, j) =>
      R.compose(
        R.map(
          ([iK,jK]) => ([i,j]) => [i+iK, j+jK]
        ),
        R.reject(([i,j]) => i===0 && j===0),
        R.map(
          ([[kx0, ky0], [kx1, ky1]]) => [kx0-kx1, ky0-ky1]
        ),
        R.transpose
      )(
        [kix[i], kix[j]]
      )

  const getNexts = [
    // ccw
    R.ifElse(
      R.equals(0),
      R.always(3),
      R.add(-1)
    ),
    // cw
    R.ifElse(
      R.equals(3),
      R.always(0),
      R.add(1)
    )
  ]

  return R.map(
    getNext =>
      R.map(
        R.chain(
          nextI => i => subroutine(i, nextI),
          getNext
        ),
        range(4)
      ),
    getNexts
  )
}

const kickers =
  R.map(
    R.compose(
      R.memoizeWith(R.identity, makeKickers),
      getKicks
    ),
    bloset
  )

const getInitialPos =
  (cols, rows, numCompletedRows=0) =>
    [
      Math.floor(cols / 2) - 1,
      rows + numCompletedRows
    ]

const getInitialOffsets = R.flip(R.prop)(offsets)

const blockOffsetsTable =
  R.compose(
    R.fromPairs,
    R.map(kind => [kind, getInitialOffsets(kind)])
  )(bloset)

const getBloPoints = R.flip(R.prop)(blockOffsetsTable)

const makeBlo =
  (cols, rows, numCompletedRows=0) =>
    R.applySpec({
      kind: R.identity,
      points: getBloPoints,
      pos: R.always(getInitialPos(cols, rows, numCompletedRows))
    })

export {
  bloset,
  blueGetRandomBlokind,
  getBloPoints,
  kickers,
  makeBlo,
  numBlos,
  MT,
  redGetRandomBlokind,
}
