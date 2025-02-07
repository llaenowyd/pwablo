import * as R from 'ramda'

import { actions } from '../../actions'
import blueTick from './blue-tick'

/**
 * blueStartTick: tbd unthunk
 */
export default maybeNextMode => (dispatch, getState) =>
  R.compose(
    dispatch,
    R.mergeLeft({ type: actions.setTick }),
    R.objOf('payload'),
    R.converge(
      R.mergeRight,
      [
        R.identity,
        R.applySpec({
          mode: R.compose(
            R.flip(R.defaultTo)(maybeNextMode),
            R.prop('mode')
          ),
          idle: R.always(false),
          next: R.converge(
            setTimeout,
            [
              R.always(R.thunkify(dispatch)(blueTick)),
              R.prop('interval'),
            ]
          ),
          prevT0: R.always(Date.now()),
        }),
      ]
    ),
    R.prop('tick')
  )(getState())
