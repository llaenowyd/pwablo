import * as R from 'ramda'

const initialOffsets = {
  I: [[0,2],[1,2],[2,2],[3,2]],
  J: [[0,3],[1,3],[2,3],[2,2]],
  L: [[0,2],[1,2],[2,2],[2,3]],
  O: [[1,2],[2,2],[2,1],[1,1]],
  S: [[0,2],[1,2],[1,3],[2,3]],
  T: [[0,2],[1,2],[2,2],[1,3]],
  Z: [[0,3],[1,3],[1,2],[2,2]]
}

const getInitialOffsets = R.flip(R.prop)(initialOffsets)

const makeMakeTet = tetc => pos =>
  (offsets =>
    R.juxt(
      R.map(
        xl =>
          R.apply(R.compose)([
            R.over(R.lensIndex(0), R.add(xl[0])),
            R.over(R.lensIndex(1), R.add(xl[1]))
          ])
      )(offsets)
    )(pos)
  )(getInitialOffsets(tetc))

const create = R.compose(
  R.fromPairs,
  R.map(tetc => [tetc, makeMakeTet(tetc)]),
  R.split('')
)('IJLOSTZ')

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

export { create, palette }
