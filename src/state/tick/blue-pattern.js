import * as R from 'ramda'

import { bloset, numBlos } from '../../blo'
import { getBlueRand, rtoo } from '../../random'
import { actions } from '../actions'

export default (dispatch, getState) => {
  const { game } = getState()
  const { bucket, size } = game
  const [cols, rows] = size
  const n = cols

  const setNextBucket = nextBucket => dispatch({type: actions.setBucket, payload: nextBucket})
  const zipWithApply = R.zipWith((f, x) => f(x))

  R.compose(
    setNextBucket,
    R.converge(
      R.reduce(
        (nextBucket, [row, col, blo]) => R.adjust(col, R.set(R.lensIndex(row), blo), nextBucket)
      ), [
        R.prop('bucket'),
        R.prop('picks'),
      ]
    ),
    R.chain(
      R.mergeLeft,
      R.compose(
        R.objOf('picks'),
        R.map(
          zipWithApply([
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
      )
    )
  )({ n, bucket, rows, cols })
}
