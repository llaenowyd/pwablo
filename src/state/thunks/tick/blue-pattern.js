import * as R from 'ramda'

import { bloset, numBlos } from '~/blo'
import { getBlueRand, rtoo } from '~/random'

import { actions } from '../../actions'

export default (dispatch, getState) => {
  const { game } = getState()
  const { bucket, size } = game
  const [cols, rows] = size
  const n = cols

  const setNextBucket = nextBucket => dispatch({type: actions.setBucket, payload: nextBucket})

  R.compose(
    setNextBucket,
    R.converge(
      R.reduce(
        (nextBucket, [row, col, blo]) => R.adjust(col, R.set(R.lensIndex(row), blo), nextBucket)
      ), [
        R.prop('bucket'),
        R.compose(
          R.map(
            R.zipWith((f, x) => f(x))([
              rtoo(rows),
              rtoo(cols),
              R.compose(
                R.flip(R.nth)(bloset),
                rtoo(numBlos)
              ),
            ]),
          ),
          R.splitEvery(3),
          getBlueRand(),
          R.multiply(3),
          R.prop('n')
        ),
      ]
    )
  )({ n, bucket })
}
