import * as R from 'ramda'

import { redGetRandomBlokind } from '~/blo'

import { actions } from '../actions'

export default (dispatch, getState) =>
  (({bag, size}) =>
      (cells => {
        function gnb(result, bag) {
          if (result.length === cells) return Promise.resolve(result)

          return redGetRandomBlokind(bag).then(
            ([np, nb]) => gnb(R.append(np, result), nb)
          )
        }

        return gnb([], bag).then(
          R.splitEvery(size[1])
        ).then(
          bucket => {
            dispatch({
              type: actions.setBucket,
              payload: bucket
            })
          }
        )
      })(R.apply(R.multiply)(size))
  )(
    R.prop('game', getState())
  )
