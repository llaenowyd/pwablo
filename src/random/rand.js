import * as R from 'ramda'

const mathRand = R.times(Math.random)

const uint32ToRand = R.multiply(1 / (2**32 - 1))

const cryptoRand = (buffers => n => {
  const buffer = buffers[n] ?? (() => buffers[n] = new Uint32Array(n))()

  self.crypto.getRandomValues(buffer)

  const result = []
  for (const rx of buffer.values()) result.push(uint32ToRand(rx))

  return result
})({})

let rands = {
  math: mathRand,
  crypto: cryptoRand,
  override: null,
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
