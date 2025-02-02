import * as R from 'ramda'

import {isOpen} from '../bucket'

import {clearRows, drawBlo, eraseBlo} from './draw'

const translateAndTest =
  (axIndex, op) =>
    (bucket, blo) => {
      const translatedBlo =
        R.over(
          R.lensPath(['pos', axIndex]),
          op
        )(
          blo
        )

      return isOpen(bucket, blo)(translatedBlo) ? [true, translatedBlo] : [false, blo]
    }

const maybeTranslate =
  (axIndex, op) =>
    R.chain(
      ([bucket, blo, tat]) => {
        const [wasTat, tatBlo] = tat(bucket, blo)

        return wasTat
          ? R.compose(
            state => drawBlo(state)(tatBlo),
            R.set(R.lensPath(['game', 'actiBlo']), tatBlo),
            state => eraseBlo(state)(blo)
          ) : R.identity
      },
      R.juxt([
        R.path(['game', 'bucket']),
        R.path(['game', 'actiBlo']),
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
      R.lensPath(['game', 'actiBlo', 'pos', 1]),
      R.add(-1)
    )
  )
