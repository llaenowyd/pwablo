import * as R from 'ramda'

import makeRange from './fun/makeRange'

export const getEmptyBucket = (rows=20, cols=10) =>
  R.map(
    () => R.map(
      R.always(0),
      makeRange(rows+2)
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
        (prevBuckTet, nextBuckTet) =>
          isOpenPoints(bucket, prevBuckTet.points, nextBuckTet.points)
      )(
        moveToBucket(prevTet),
        moveToBucket(nextTet)
      )

export const completeRows =
  R.chain(
    rowsToTest =>
      R.chain(
        completedRows =>
          completedRows.length === 0
            ? R.identity
            : R.over(
              R.lensPath(['game', 'completedRows']),
              R.concat(completedRows)
            ),
        R.compose(
         bucket =>
           R.reject(
             R.compose(
               R.any(R.equals(0)),
               R.flip(R.pluck)(bucket)
             ),
             rowsToTest
           ),
         R.path(['game', 'bucket'])
        )
      ),
    R.compose(
      R.uniq,
      R.map(R.nth(1)),
      R.prop('points'),
      moveToBucket,
      R.path(['game', 'actiTet'])
    )
  )
