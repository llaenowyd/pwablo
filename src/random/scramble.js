import * as R from 'ramda'

import { getRand } from './rand'

import rtoo from './rtoo'

/**
 * scramble - return a random permutation of a list 
 */
export default R.compose(
  ([a, len]) => {
    const rx = getRand()(len - 1)
    const result = R.clone(a)

    for (let offset = 0; offset < len-1; offset++) {
      const remaining = len - offset
      const pickOffset = offset + rtoo(remaining, rx[offset])
      const pick = result[pickOffset]
      result[pickOffset] = result[offset]
      result[offset] = pick
    }

    return result
  },
  R.adjust(1, R.length),
  R.flip(R.repeat)(2)
)
