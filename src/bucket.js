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

const isOpenPoints =
  (bucket, prevPoints, newPoints) =>
    R.none(
      ([i,j]) =>
        i < 0
        || j < 0
        || i >= bucket.length
        || (
          0 > R.findIndex(([ib,jb]) => ib===i && jb===j, prevPoints)
          && R.defaultTo('', bucket[i]?.[j]) !== 0
        )
    )(newPoints)


const moveToOrigin =
  R.chain(
    ([x,y]) =>
      R.over(
        R.lensProp('points'),
        R.map(([i, j]) => [i - x, j - y])
      ),
    R.prop('pos')
  )

const moveToBucket =
  R.chain(
    ([x,y]) =>
      R.over(
        R.lensProp('points'),
        R.map(([i, j]) => [i + x, j + y])
      ),
    R.prop('pos')
  )

export const isOpen =
  (bucket, prevTet) =>
    nextTet =>
      (
        (prevBuckTet, nextBuckTet) => isOpenPoints(bucket, prevBuckTet.points, nextBuckTet.points)
      )(
        moveToBucket(prevTet),
        moveToBucket(nextTet)
      )
