import * as R from 'ramda'

import makeRange from './fun/makeRange'

export const getEmptyBucket = (rows=20, cols=10) =>
  R.map(
    () => R.map(
      R.always(0),
      makeRange(rows)
    ),
    makeRange(cols)
  )
