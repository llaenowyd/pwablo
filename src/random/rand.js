import * as R from 'ramda'

const blueMathRand = R.times(Math.random)
const redMathRand = n => Promise.resolve(blueMathRand(n))

const uint32ToRand = R.multiply(1 / (2**32 - 1))

const blueCryptoRand = (buffers => n => {
  const buffer = buffers[n] ?? (() => buffers[n] = new Uint32Array(n))()

  self.crypto.getRandomValues(buffer)

  const result = []
  for (const rx of buffer.values()) result.push(uint32ToRand(rx))

  return result
})({})

const redCryptoRand = n => Promise.resolve(blueCryptoRand(n))

let blueRands = {
  math: blueMathRand,
  crypto: blueCryptoRand,
  override: null,
}

let redRands = {
  math: redMathRand,
  crypto: redCryptoRand,
  override: null,
}

export const setBlueRand = rand => {
  blueRands = R.set(R.lensProp('override'), rand, blueRands)
}

export const setRedRand = rand => {
  redRands = R.set(R.lensProp('override'), rand, redRands)
}

export const getBlueRand = () => R.cond([
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
])(blueRands)

export const getRedRand = () => R.cond([
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
])(redRands)
