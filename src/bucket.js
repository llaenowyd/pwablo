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

export const groupCompletedRows =
  R.compose(
    R.map(
      R.converge(
        (len, min, max) => [len, [min, max]],
        [
          R.length,
          R.apply(Math.min),
          R.apply(Math.max)
        ]
      )
    ),
    R.groupWith((a, b) => b - a === 1)
  )

const makeSentinel =
  endRow =>
    R.compose(
      R.set(
        R.compose(R.lensIndex(1), R.lensIndex(1)),
        endRow
      ),
      R.last
    )

export const digestCompletedGroups =
  endRow =>
    R.compose(
      R.converge(
        R.flip(R.concat),
        [
          R.compose(
            R.of,
            makeSentinel(endRow)
          ),
          R.compose(
            R.map(
              ([group, nextGroup]) =>
                R.compose(
                  R.set(R.lensPath([1, 1])),
                  R.view(R.lensPath([1, 0]))
                )(nextGroup)(group)
            ),
            R.aperture(2)
          )
        ]
      ),
      R.last,
      R.reduce(
        ([rowsCompleted, result], [groupSize, range]) =>
          (nextRowsCompleted =>
              [
                nextRowsCompleted,
                R.append(
                  [nextRowsCompleted, range],
                  result
                )
              ]
          )(
            rowsCompleted + groupSize
          ),
        [0, []])
    )

export const getFallRanges =
  endRow =>
    R.ifElse(
      R.isEmpty,
      R.always([]),
      R.compose(
        digestCompletedGroups(endRow),
        groupCompletedRows
      )
    )
