import * as R from 'ramda'

import { getRedRand } from './rand'

import rtoo from './rtoo'

/**
 * scramble - return a random permutation of a list 
 */
export default a =>
  (len =>
    getRedRand()(len-1).then(
      rx => {
        const result = R.clone(a)

        for (let offset = 0; offset < len-1; offset++) {
          const remaining = len - offset
          const pickOffset = offset + rtoo(remaining, rx[offset])
          const pick = result[pickOffset]
          result[pickOffset] = result[offset]
          result[offset] = pick
        }

        return result
      }
    )
  )(a.length)
