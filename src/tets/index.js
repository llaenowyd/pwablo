import * as R from 'ramda'

const tetset = ['I','J','L','O','S','T','Z']

const initialOffsets = {
  I: [[1,2],[2,2],[3,2],[4,2]],
  J: [[0,2],[0,1],[1,1],[2,1]],
  L: [[0,1],[1,1],[2,1],[2,2]],
  O: [[1,1],[1,2],[2,2],[2,1]],
  S: [[0,1],[1,1],[1,2],[2,2]],
  T: [[0,1],[1,1],[2,1],[1,2]],
  Z: [[0,2],[1,2],[1,1],[2,1]]
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

const getInitialPos =
  (cols, rows) =>
    tet =>
      (tetSz =>
        [
          Math.floor(cols / 2) - tetSz - 1,
          rows - tetSz
        ]
      )(tet === 'I' ? 2 : 1)

const getInitialOffsets = R.flip(R.prop)(initialOffsets)

const makeTet =
  tetc =>
    (
      tbl =>
        R.defaultTo(
          [],
          R.prop(tetc, tbl)
        )
    )(
      R.compose(
        R.fromPairs,
        R.map(tetc => [tetc, getInitialOffsets(tetc)])
      )(tetset)
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

export { getInitialPos, kicks, makeTet, palette, tetset }
