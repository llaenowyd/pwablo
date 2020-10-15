import { Alert } from 'react-native'

import * as R from 'ramda'

import { completeRows } from '../bucket'
import { makeTet } from '../tets'

import { getActionName } from './actions'
import { setFlash, stopFlash } from './animation'
import { getInitialState, initialActiTet } from './initialState'
import { clearCompletedRows, drawActiTet, leftRot, riteRot, left, rite, up, fall } from './matrixReducers'
import { tryCatcher } from './common'

const reinitState =
  state =>
    (
      ([cols, rows]) =>
        R.mergeLeft(
          R.pick(['clock', 'style'], state),
          getInitialState(rows, cols)
        )
    )(
      R.path(['game', 'size'], state)
    )

const stopTickReducer =
  R.over(
    R.lensProp('tick'),
    tick => {
      const {next} = tick
      if (next) clearTimeout(next)

      return R.mergeLeft(
        {
          next: null,
          idle: true
        },
        tick
      )
    }
  )

const inputReducer =
  tryCatcher('inputReducer')(
    key =>
      R.chain(
        R.set(R.lensProp('input')),
        R.compose(
          R.append(key),
          R.prop('input')
        )
      )
  )

const useNextTet =
  R.chain(
    ([nextTetKind, [cols, rows]]) =>
      R.compose(
        R.set(
          R.lensPath(['game', 'nextTet']),
          null
        ),
        R.set(
          R.lensPath(['game', 'actiTet']),
          R.mergeLeft(
            makeTet(cols, rows)(nextTetKind),
            initialActiTet
          )
        )
      ),
    R.juxt([
      R.view(R.lensPath(['game', 'nextTet'])),
      R.view(R.lensPath(['game', 'size']))
    ])
  )

const fallOrSettleAndUseNext =
  R.compose(
    R.ifElse(
      R.nth(1), // did fall
      R.nth(0), // just state
      R.compose(
        useNextTet,
        R.chain(
          setFlash,
          R.path(['game', 'completedRows'])
        ),
        completeRows,
        R.nth(0)
      )
    ),
    fall
  )

// speed=level-1
// at speed=0, clockRate=8 ticks per clock
// at speed=1, clockRate-1=7 ticks per clock
// at speed=7, clockRate-7=1 tick per clock
// speedLimit=clockRate-1
const clockTickReducer =
  R.compose(
    R.chain(
      ([clockRate, gameLevel]) =>
        R.over(
          R.lensPath(['game', 'clock']),
          R.ifElse(
            R.lt(0),
            R.add(-1),
            R.always(clockRate - gameLevel - 1)
          )
        ),
      R.juxt([
        R.path(['clock', 'rate']),
        R.path(['game', 'level'])
      ])
    ),
    R.when(
      R.path(['game', 'actiTet', 'dropping']),
      fallOrSettleAndUseNext
    )
  )

const isDev = __DEV__

const checkReducer =
  name => redFn =>
    isDev ?
      (state, action) => {
        if (getActionName(action.type) !== name) {
          throw new Error(`${action.type} in ${name} handler`)
        }
        return redFn(state, action)
      }
      : redFn

export const reducerList = [
  checkReducer('setTick')(
    (state, {payload: nextTick}) =>
      R.over(
        R.lensProp('tick'),
        ({next}) => {
          if (next) clearTimeout(next)
          return (nextTick)
        }
      )(state)
  ),
  checkReducer('stopTick')(
    stopTickReducer
  ),
  checkReducer('clockTick')(
    clockTickReducer
  ),
  checkReducer('fall')(
    fallOrSettleAndUseNext
  ),
  checkReducer('fallIfFalling')(
    R.chain(
      falling => falling ? fallOrSettleAndUseNext : R.identity,
      R.path(['game', 'actiTet', 'falling'])
    )
  ),
  checkReducer('setNextTet')(
    (state, {payload: [nextTet, bag]}) =>
      R.compose(
        R.set(
          R.lensPath(['game', 'nextTet']),
          nextTet
        ),
        R.set(
          R.lensPath(['game', 'bag']),
          bag
        )
      )(state)
  ),
  checkReducer('useNextTet')(useNextTet),
  checkReducer('clearInput')(
    R.set(R.lensProp('input'), [])
  ),
  checkReducer('inpLR')(inputReducer('L')),
  checkReducer('inpRR')(inputReducer('R')),
  checkReducer('inpL')(inputReducer('<')),
  checkReducer('inpR')(inputReducer('>')),
  checkReducer('inpU')(inputReducer('^')),
  checkReducer('inpD')(inputReducer('v')),
  checkReducer('leftRot')(leftRot),
  checkReducer('riteRot')(riteRot),
  checkReducer('left')(left),
  checkReducer('rite')(rite),
  checkReducer('up')(up),
  checkReducer('down')(
    R.set(
      R.lensPath(['game', 'actiTet', 'dropping']),
      true
    )
  ),
  checkReducer('clearCompletedRows')(
    R.compose(
      clearCompletedRows,
      stopFlash
    )
  ),
  checkReducer('drawActiTet')(drawActiTet),
  checkReducer('reset')(
    R.compose(
      reinitState,
      stopTickReducer
    )
  ),
  checkReducer('setBucket')(
    (state, action) =>
      R.set(
        R.lensPath(['game', 'bucket']),
        action.payload,
        state
      )
  ),
  checkReducer('toggleMatrixStyle')(
    R.over(
      R.lensPath(['style']),
      R.chain(
        nextMatrixStyle => R.assoc('matrix', nextMatrixStyle),
        R.compose(
          R.ifElse(
            R.equals(1),
            R.always(0),
            R.add(1)
          ),
          R.prop('matrix')
        )
      )
    )
  )
]

const logActionTypeOrId =
  isDev
    ? (actionId, actionType) => {
        console.log(`*** ${actionId === null ? actionType : getActionName(actionId)}`)
      }
    : () => {}

export const reducer =
  (state, action) => {
    const actionType = action?.type

    const actionId = Number.isFinite(actionType) ? actionType : null

    logActionTypeOrId(actionId, actionType)

    if (actionId !== null) {
      const rf = reducerList[actionId]

      if (rf) {
        return rf(state, action)
      }
    }

    if ('@@redux/' !== R.take(8, actionType))
      Alert.alert('unexpected', `unknown event '${actionType}'`)
    return state
  }

export const reducerX = (state, action) => {
  const {type: actionType} = action

  console.log(`*** ${actionType}`, state)

  return state
}
