import * as R from 'ramda'

const cryptoRand = null

let rands = {
  math: n => Promise.resolve(R.times(Math.random, n)),
  crypto: cryptoRand,
  override: null
}

export const setRand = rand => {
  rands = R.set(R.lensProp('override'), rand, rands)
}

export const getRand = () => R.cond([
  [
    R.compose(
      R.complement(R.isNil),
      R.prop('override')
    ),
    R.prop('override'),
  ],
  [
    R.compose(
      R.complement(R.isNil),
      R.prop('crypto')
    ),
    R.prop('crypto'),
  ],
  [
    R.T,
    R.prop('math'),
  ]
])(rands)
