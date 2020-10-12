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

const getInitialPos =
  (cols, rows) =>
    kind =>
      (sz =>
        [
          Math.floor(cols / 2) - sz - 1,
          rows - sz
        ]
      )(kind === 'I' ? 2 : 1)

const getInitialOffsets = R.flip(R.prop)(blockOffsets)

const blockOffsetsTable =
  R.compose(
    R.fromPairs,
    R.map(kind => [kind, getInitialOffsets(kind)])
  )(tetset)

const makeTet =
  (cols, rows) =>
    (gip =>
      R.applySpec({
        kind: R.identity,
        points: R.flip(R.prop)(blockOffsetsTable),
        pos: gip
      })
    )(
      getInitialPos(cols, rows)
    )

const palette = {
  primary: {
    I: '#31C7EF',
    J: '#5A65AD',
    L: '#EF7921',
    O: '#F7D308',
    S: '#42B642',
    T: '#AE0BF7',
    Z: '#EF2029'
  },
  complement: {
    I: '#301109',
    J: '#ffee81',
    L: '#0c3554',
    O: '#030f4f',
    S: '#30122f',
    T: '#050d00',
    Z: '#031211'
  },
  shadow: {
    I: '#357180',
    J: '#181e47',
    L: '#784b26',
    O: '#96841f',
    S: '#3a6639',
    T: '#611f7d',
    Z: '#632022'
  },
  highlight: {
    I: '#b2d7d9',
    J: '#bdc7f7',
    L: '#f0c696',
    O: '#f2e699',
    S: '#b4f0ac',
    T: '#dd9ff5',
    Z: '#ed9387'
  }
}

export { getInitialPos, kickers, kicks, makeTet, palette, tetset }
