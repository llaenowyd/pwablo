import * as R from 'ramda'

import makeRange from '../fun/makeRange'

const tetset = ['I','J','L','O','S','T','Z']

const blockOffsets = {
  I: [[-1,0],[0,0],[1,0],[2,0]],
  J: [[-1,1],[-1,0],[0,0],[1,0]],
  L: [[-1,0],[0,0],[1,0],[1,1]],
  O: [[0,0],[1,0],[1,1],[0,1]],
  S: [[-1,0],[0,0],[0,1],[1,1]],
  T: [[-1,0],[0,0],[1,0],[1,1]],
  Z: [[-1,1],[0,1],[0,0],[1,0]]
}

const commonKicks = [
  [[0,0], [0,0], [0,0], [0,0], [0,0]],
  [[0,0], [1,0], [1,-1], [0,2], [1,2]],
  [[0,0], [0,0], [0,0], [0,0], [0,0]],
  [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]
]

const kicks = {
  I: [
    [[0, 0], [-1, 0], [2, 0], [-1, 0], [2, 0]],
    [[-1, 0], [0, 0], [0, 0], [0,1], [0,-2]],
    [[-1,1], [1,1], [-2,1], [1, 0], [-2, 0]],
    [[0,1], [0,1], [0,1], [0,-1], [0,2]]
  ],
  J: commonKicks,
  L: commonKicks,
  O: [
    [[0, 0]],
    [[0,-1]],
    [[-1,-1]],
    [[-1, 0]]
  ],
  S: commonKicks,
  T: commonKicks,
  Z: commonKicks
}

const makeKickers = kix => {
  const subroutine =
    (i, j) =>
      R.compose(
        R.map(
          ([iK,jK]) => R.map(([i,j]) => [i+iK, j+jK])
        ),
        R.reject(([i,j]) => i===0 && j===0),
        R.map(
          ([[kx0, ky0], [kx1, ky1]]) => [kx0-kx1, ky0,ky1]
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
        makeRange(4)
      )
  )(getNexts)
}

const commonKickers = makeKickers(commonKicks)

const kickers = {
  I: makeKickers(kicks.I),
  J: commonKickers,
  L: commonKickers,
  O: makeKickers(kicks.O),
  S: commonKickers,
  T: commonKickers,
  Z: commonKickers
}

// shouldn't it be required
const getBoundingRadius = kind => kind === 'I' ? 2 : 1

const getInitialPos =
  (cols, rows) =>
    [
      Math.floor(cols / 2) - 1,
      rows
    ]

const getInitialOffsets = R.flip(R.prop)(blockOffsets)

const blockOffsetsTable =
  R.compose(
    R.fromPairs,
    R.map(kind => [kind, getInitialOffsets(kind)])
  )(tetset)

const makeTet =
  (cols, rows) =>
    R.applySpec({
      kind: R.identity,
      points: R.flip(R.prop)(blockOffsetsTable),
      pos: R.always(getInitialPos(cols, rows))
    })

export { kickers, makeTet, tetset }
