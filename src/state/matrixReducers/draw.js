import * as R from 'ramda'

import { MT } from '~/blo'
import constants from '~/constants'

import { moveToBucket } from '../bucket'

const drawBloKind =
  state =>
    bloKind =>
      blo =>
        (
          pointsByColumn =>
            R.over(
              R.lensPath(['game', 'bucket']),
              R.compose(
                R.values,
                R.mapObjIndexed(
                  (col, i) =>
                    R.compose(
                      R.values,
                      R.mergeRight(col),
                      R.fromPairs,
                      R.map(row => [row, bloKind]),
                      R.defaultTo([]),
                      R.flip(R.prop)(pointsByColumn)
                    )(i)
                )
              )
            )(state)
        )(
          R.compose(
            R.map(R.map(R.nth(1))),
            R.groupBy(R.nth(0)),
            R.prop('points'),
            moveToBucket
          )(blo)
        )

export const drawBlo =
    state =>
      blo => {
        const {kind} = blo
        return drawBloKind(state)(kind)(blo)
      }

export const eraseBlo =
  state =>
    blo =>
      drawBloKind(state)(MT)(blo)

export const drawActiBlo = state =>
  drawBlo(state)(
    R.path(['game', 'actiBlo'])(state)
  )

export const eraseActiBlo = state =>
  eraseBlo(state)(
    R.path(['game', 'actiBlo'])(state)
  )

const topOffBucket =
  rowsMax =>
    R.map(
      R.chain(
        R.flip(R.concat),
        R.compose(
          R.repeat(MT),
          R.subtract(rowsMax),
          R.length
        )
      )
    )

export const clearRows =
  (cols, rows, rowsToClear) =>
    bucket => R.isEmpty(rowsToClear)
      ? bucket
      : (writeRangeEnd =>
          R.compose(
            topOffBucket(writeRangeEnd),
            R.transpose,
            R.values,
            R.omit(rowsToClear),
            R.transpose
          )(
            bucket
          )
        )(
          rows + constants.bucketBufferSize
        )
