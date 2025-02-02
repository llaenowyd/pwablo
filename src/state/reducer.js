import { Alert } from '../react-native-dummies'

import * as R from 'ramda'

import { makeBlo } from '../blo'
import constants from '../constants'

import { canFall, completeRows } from './bucket'
import { tryCatcher } from './common'
import { getInitialState, initialActiTet } from './initialState'
import {
  clearCompletedRows,
  drawActiBlo,
  eraseActiTet,
  leftRot,
  riteRot,
  left,
  rite,
  fall } from './matrixReducers'

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
            makeBlo(cols, rows)(nextTet),
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
      drawActiBlo,
      finishGame
    ),
    useNextTet,
    addPointsAndMaybeLevelUp,
    // R.chain(
    //   setFlash,
    //   R.path(['game', 'completedRows'])
    // ),
    completeRows
  )

const fallOrSettle =
  R.ifElse(
    canFall,
    R.compose(
      drawActiBlo,
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

export const reducerTable = {
  setTick:
    (state, {payload: nextTick}) =>
      R.over(
        R.lensProp('tick'),
        ({next}) => {
          if (next) clearTimeout(next)
          return (nextTick)
        }
      )(state),
  stopTick: stopTickReducer,
  clockTick: clockTickReducer,
  fall: fallOrSettle,
  fallIfFalling: R.chain(
      falling => falling ? fallOrSettle : R.identity,
      R.path(['game', 'actiTet', 'falling'])
    ),
  setNextTet:
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
      )(state),
  useNextTet,
  clearInput: R.set(R.lensProp('input'), []),
  inpLR: inputReducer('L'),
  inpRR: inputReducer('R'),
  inpL:inputReducer('<'),
  inpR:inputReducer('>'),
  inpD:inputReducer('v'),
  leftRot,
  riteRot,
  left,
  rite,
  down:
    R.set(
      R.lensPath(['game', 'actiTet', 'dropping']),
      true
    ),
  clearCompletedRows:
    R.compose(
      drawActiBlo,
      clearCompletedRows,
      eraseActiTet,
      // stopFlash
    ),
  reset:
    R.compose(
      reinitState,
      stopTickReducer
    ),
  setBucket:
    (state, action) =>
      R.set(
        R.lensPath(['game', 'bucket']),
        action.payload,
        state
      ),
  toggleMatrixStyle:
    R.over(
      R.lensPath(['style', 'matrix']),
      R.compose(
        R.flip(R.modulo)(
          R.compose(
            R.length,
            R.keys
          )(constants.matrixStyle)
        ),
        R.add(1)
      )
    ),
  setupNewGame:
    R.compose(
      R.set(R.lensPath(['game', 'score']), 0),
      reinitState,
      stopTickReducer
    ),
  toggleMusic: R.over(R.lensPath(['audio', 'music', 'enabled']), R.not),
}

export const reducer =
  (state, action) => {
    const actionType = action?.type

    const rf = reducerTable[actionType]

    if (rf != null) {
      return rf(state, action)
    }

    if ('@@redux/' !== R.take(8, actionType))
      Alert.alert('unexpected', `unknown event '${actionType}'`)
    return state
  }
