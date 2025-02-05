import * as R from 'ramda'

import { blueGetRandomBlokind } from '../../random'
import { actions } from '../actions'

const blueGnb = n => {
  const isComplete = R.compose(R.equals(n), R.length)

  function rec(result, bag) {
    if (isComplete(result)) return result

    const [blo, nextBag] = blueGetRandomBlokind(bag)
    return rec(R.append(blo, result), nextBag)
  }

  return rec([], [])
}

export default (dispatch, getState) => {
  const setNextBucket = nextBucket => dispatch({ type: actions.setBucket, payload: nextBucket })

  R.compose(
    setNextBucket,
    R.apply(R.call),
    R.juxt([
      R.compose(
        R.splitEvery,
        R.nth(1)
      ),
      R.compose(
        blueGnb,
        R.apply(R.multiply)
      )
    ]),
    R.path(['game', 'size'])
  )(getState())
}
