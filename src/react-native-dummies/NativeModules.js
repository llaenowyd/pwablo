import * as R from 'ramda'

export default {
  Sha1: {
    rand: (n) => Promise.resolve(R.times(Math.random, n))
  }
}
