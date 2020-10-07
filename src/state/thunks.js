import * as R from 'ramda'

import makeRange from '../fun/makeRange'
import { getNextPiece, rand } from '../Random'

const makeRandomFill = (dispatch, getState) =>
  (({bag, size}) =>
      (cells => {
        function gnp(result, bag) {
          if (result.length === cells) return Promise.resolve(result)

          return getNextPiece(bag).then(
            ([np, nb]) => gnp(R.append(np, result), nb)
          )
        }

        return gnp([], bag).then(
          R.splitEvery(size[0])
        ).then(
          bucket => {
            dispatch({
              type: 'setBucket',
              payload: bucket
            })
          }
        )
      })(size[0]*size[1])
  )(
    R.prop('game', getState())
  )

export default {
  randomFill: () => makeRandomFill,
  doTestPattern: () => (dispatch, getState) =>
    makeRandomFill(dispatch, getState).then(
      () => dispatch({type: 'setMode', payload: 'testPattern'})
    ),
  tick: () => (dispatch, getState) => {
    const { game, mode } = getState()
    const { bucket, size } = game
    const [rows, cols] = size
    const n = 20

    if (mode === 'testPattern')
      return Promise.resolve(
        dispatch({type: 'startTimer', payload: Date.now()})
      ).then(
        () => rand(3 * n)
      ).then(
        rx =>
          R.map(
            i =>
              R.applySpec({
                rowIndex: R.compose(
                  Math.floor,
                  R.multiply(rows),
                  R.nth(3 * i)
                ),
                colIndex: R.compose(
                  Math.floor,
                  R.multiply(cols),
                  R.nth(3 * i + 1)
                ),
                tet: R.compose(
                  R.flip(R.nth)(['I', 'J', 'L', 'O', 'S', 'T', 'Z']),
                  Math.floor,
                  R.multiply(7),
                  R.nth(3 * i + 2)
                )
              })(rx),
            makeRange(n)
          )
      ).then(
        adjs =>
          R.reduce(
            (bucket, {rowIndex, colIndex, tet}) =>
              R.over(
                R.lensIndex(colIndex),
                R.set(R.lensIndex(rowIndex), tet)
              )(bucket),
            bucket,
            adjs
          )
      ).then(
        bucket => dispatch({type: 'setBucket', payload: bucket})
      ).then(
        () => dispatch({type: 'stopTimer', payload: Date.now() })
      )
    else return Promise.resolve()
  }
}
