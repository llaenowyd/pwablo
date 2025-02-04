import * as R from 'ramda'

import { bloset, numBlos } from '../../blo'
import { getRedRand, rtoo } from '../../random'
import range from '../../range'
import { actions } from '../actions'

export default (dispatch, getState) => {
  const { game } = getState()
  const { bucket, size } = game
  const [cols, rows] = size
  const n = cols

  return R.pipeWith(
    R.andThen,
    [
      () => getRedRand()(3 * n),
      rx =>
        R.map(
          i =>
            R.applySpec({
              rowIndex: R.compose(
                rtoo(rows),
                R.nth(3 * i)
              ),
              colIndex: R.compose(
                rtoo(cols),
                R.nth(3 * i + 1)
              ),
              blo: R.compose(
                R.flip(R.nth)(bloset),
                rtoo(numBlos),
                R.nth(3 * i + 2)
              )
            })(rx),
          range(n)
        ),
      adjs =>
        R.reduce(
          (bucket, {rowIndex, colIndex, blo}) =>
            R.adjust(
              colIndex,
              R.set(R.lensIndex(rowIndex), blo)
            )(bucket),
          bucket,
          adjs
        ),
      bucket => dispatch({type: actions.setBucket, payload: bucket})
    ]
  )()
}
