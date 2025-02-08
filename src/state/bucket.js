import * as R from 'ramda'

import { MT } from '~/blo'
import constants from '~/constants'
import range from '~/range'

export const getEmptyBucket = (rows, cols) =>
  R.map(
    () => R.repeat(MT, rows + constants.bucketBufferSize),
    range(cols)
  )

const makeDisjoins =
  R.chain(
    indexes =>
      R.chain(
        indexedPoints =>
          points =>
            R.map(
              ([index, point]) => [
                point,
                R.compose(
                  R.values,
                  R.omit([index])
                )(points)
              ]
            )(indexedPoints),
        points => R.transpose([indexes, points]),
      ),
    R.compose(
      range,
      R.length
    )
  )

const fall1OnDisjoins =
  R.map(
    R.over(
      R.lensPath([0, 1]),
      R.add(-1)
    )
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
          && R.defaultTo('', bucket[i]?.[j]) !== MT
        )
    )(
      newPoints
    )

const isOpenDisjoins =
  (bucket, disjoins) =>
    R.none(
      R.compose(
        ([[i,j], dsjs]) =>
          i < 0
          || j < 0
          || i >= bucket.length
          || (
            0 > R.findIndex(([ib,jb]) => ib===i && jb===j, dsjs)
            && bucket[i][j] !== MT
          )
      )
    )(
      disjoins
    )

export const moveToBucket =
  R.chain(
    ([x,y]) =>
      R.over(
        R.lensProp('points'),
        R.map(([i, j]) => [i + x, j + y])
      ),
    R.prop('pos')
  )

export const isOpen =
  (bucket, prevBlo) =>
    nextBlo =>
      (
        (prevBuckBlo, nextBuckBlo) =>
          isOpenPoints(bucket, prevBuckBlo.points, nextBuckBlo.points)
      )(
        moveToBucket(prevBlo),
        moveToBucket(nextBlo)
      )

export const completeRows =
  R.chain(
    rowsToTest =>
      R.chain(
        completedRows =>
          completedRows.length === 0
            ? R.identity
            : R.set(
              R.lensPath(['game', 'completedRows']),
              completedRows
            ),
        R.compose(
          bucket =>
            R.reject(
              R.compose(
                R.any(R.equals(MT)),
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
      R.path(['game', 'actiBlo'])
    )
  )

// state -> bool
export const canFall =
  R.compose(
    ([bucket, fellDisjoins]) => isOpenDisjoins(bucket, fellDisjoins),
    R.juxt([
      R.path(['game', 'bucket']),
      R.compose(
        fall1OnDisjoins,
        makeDisjoins,
        R.prop('points'),
        moveToBucket,
        R.path(['game', 'actiBlo'])
      )
    ])
  )
