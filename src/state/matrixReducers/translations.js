import * as R from 'ramda'

import {isOpen} from '../../bucket'

import {clearRows, drawTet, eraseTet} from './draw'

const translateAndTest =
  (axIndex, op) =>
    (bucket, tet) => {
      const translatedTet =
        R.over(
          R.lensPath(['pos', axIndex]),
          op
        )(
          tet
        )

      return isOpen(bucket, tet)(translatedTet) ? [true, translatedTet] : [false, tet]
    }

const maybeTranslate =
  (axIndex, op) =>
    R.chain(
      ([bucket, tet, tat]) => {
        const [wasTat, tatTet] = tat(bucket, tet)

        return wasTat
          ? R.compose(
            state => drawTet(state)(tatTet),
            R.set(R.lensPath(['game', 'actiTet']), tatTet),
            state => eraseTet(state)(tet)
          ) : R.identity
      },
      R.juxt([
        R.path(['game', 'bucket']),
        R.path(['game', 'actiTet']),
        R.thunkify(translateAndTest)(axIndex, op)
      ])
    )

export const left = maybeTranslate(0, R.add(-1))

export const rite = maybeTranslate(0, R.add(1))

export const down = maybeTranslate(1, R.add(-1))

export const clearCompletedRows =
  R.chain(
    ([completedRows, [cols, rows]]) =>
      R.isEmpty(completedRows)
        ? R.identity
        : R.compose(
            R.set(
              R.lensPath(['game', 'completedRows']),
              []
            ),
            R.over(
              R.lensPath(['game', 'bucket']),
              clearRows(cols, rows, completedRows)
            )
          ),
    R.juxt([
      R.path(['game', 'completedRows']),
      R.path(['game', 'size'])
    ])
  )

export const fall =
  R.compose(
    R.over(
      R.lensPath(['game', 'actiTet', 'pos', 1]),
      R.add(-1)
    )
  )
