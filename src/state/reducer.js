import { Alert } from 'react-native'

import * as R from 'ramda'

import { canFall, completeRows } from '../bucket'
import { makeTet } from '../tets'

import { getActionName } from './actions'
import { setFlash, stopFlash } from './animation'
import { getInitialState, initialActiTet } from './initialState'
import { clearCompletedRows, drawActiTet, eraseActiTet, leftRot, riteRot, left, rite, fall } from './matrixReducers'
import { tryCatcher } from './common'

const taglog = tag => x => { console.log(tag, x); return x }

const reinitState =
  state =>
    (
      ([cols, rows]) =>
        R.mergeLeft(
          R.pick(['audio', 'clock', 'style'], state),
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

const setSoundEffect =
  soundEffectName =>
    R.over(
      R.lensPath(['audio', 'sounds', soundEffectName]),
      R.unless(
        R.isNil,
        R.add(1)
      )
    )

const finishGame =
  R.compose(
    stopTickReducer,
    R.set(R.lensPath(['game', 'finished']), true)
  )

const useNextTet =
  R.chain(
    ([nextTet, [cols,rows]]) =>
      R.compose(
        R.set(
          R.lensPath(['game', 'nextTet']),
          null
        ),
        R.set(
          R.lensPath(['game', 'actiTet']),
          R.mergeLeft(
            makeTet(cols, rows)(nextTet),
            initialActiTet
          )
        )
      ),
    R.juxt([
      R.path(['game', 'nextTet']),
      R.path(['game', 'size'])
    ])
  )

const addPointsAndMaybeLevelUp =
  R.chain(
    ([numCompletedRows, level, prevRowsCleared, rowsPerLevel]) =>
      (nextRowsCleared =>
        R.compose(
          R.when(
            () => numCompletedRows === 4,
            setSoundEffect('woow')
          ),
          R.when(
            () => Math.floor(nextRowsCleared / rowsPerLevel) > Math.floor(prevRowsCleared / rowsPerLevel),
            R.compose(
              setSoundEffect('yayy'),
              R.over(
                R.lensPath(['game', 'level']),
                R.add(1)
              )
            )
          ),
          R.set(
            R.lensPath(['game', 'rowsCleared']),
            nextRowsCleared
          ),
          R.over(
            R.lensPath(['game', 'score']),
            [
              R.identity,
              R.add((level+1)*40),
              R.add((level+1)*100),
              R.add((level+1)*300),
              R.add((level+1)*1200)
            ][
              R.min(numCompletedRows, 4)
            ]
          )
        )
      )(
        prevRowsCleared + numCompletedRows
      ),
    R.juxt([
      R.compose(
        R.length,
        R.path(['game', 'completedRows'])
      ),
      R.path(['game', 'level']),
      R.path(['game', 'rowsCleared']),
      R.path(['game', 'rowsPerLevel'])
    ])
  )

const settle =
  R.compose(
    R.ifElse(
      canFall,
      drawActiTet,
      finishGame
    ),
    useNextTet,
    addPointsAndMaybeLevelUp,
    R.chain(
      setFlash,
      R.path(['game', 'completedRows'])
    ),
    completeRows
  )

const fallOrSettle =
  R.ifElse(
    canFall,
    R.compose(
      drawActiTet,
      fall,
      eraseActiTet
    ),
    settle
  )

// speed=level-1 (+3 to start faster)
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
            R.always(R.max(1, clockRate - gameLevel - 4))
          )
        ),
      R.juxt([
        R.path(['clock', 'rate']),
        R.path(['game', 'level'])
      ])
    ),
    R.when(
      R.path(['game', 'actiTet', 'dropping']),
      fallOrSettle
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
    fallOrSettle
  ),
  checkReducer('fallIfFalling')(
    R.chain(
      falling => falling ? fallOrSettle : R.identity,
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
  checkReducer('inpD')(inputReducer('v')),
  checkReducer('leftRot')(leftRot),
  checkReducer('riteRot')(riteRot),
  checkReducer('left')(left),
  checkReducer('rite')(rite),
  checkReducer('down')(
    R.set(
      R.lensPath(['game', 'actiTet', 'dropping']),
      true
    )
  ),
  checkReducer('clearCompletedRows')(
    R.compose(
      drawActiTet,
      clearCompletedRows,
      eraseActiTet,
      stopFlash
    )
  ),
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
  ),
  checkReducer('setupNewGame')(
    R.compose(
      R.set(R.lensPath(['game', 'score']), 0),
      reinitState,
      stopTickReducer
    )
  ),
  checkReducer('toggleMusic')(
    R.over(R.lensPath(['audio', 'music', 'enabled']), R.not)
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
