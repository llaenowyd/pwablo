import { Alert } from 'react-native'

import * as R from 'ramda'

import { getInitialPos, makeTet } from '../tets'

import { getInitialState, initialActiTet } from './initialState'
import { drawActiTet, leftRot, riteRot, left, rite, up, fall } from './matrixReducers'
import { tryCatcher } from './common'

const resetReducer =
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

const settle =
  R.set(
    R.lensPath(['game', 'actiTet']),
    initialActiTet
  )

const fallOrSettle =
  R.compose(
    ([state, fell]) => fell ? state : settle(state),
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
      fallOrSettle
    )
  )

export const reducer =
  (
    matchAction =>
      R.cond([
        [
          matchAction('setTick'),
          (state, {payload: tick}) => R.over(R.lensProp('tick'), R.always(tick))(state)
        ],
        [
          matchAction('clockTick'),
          clockTickReducer
        ],
        [
          matchAction('fall'),
          fallOrSettle
        ],
        [
          matchAction('setNextTet'),
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
        ],
        [
          matchAction('useNextTet'),
          R.chain(
            ([nextTetKind, [cols, rows]]) =>
              R.set(
                R.lensPath(['game', 'actiTet']),
                R.mergeLeft(
                  makeTet(cols, rows)(nextTetKind),
                  initialActiTet
                )
              ),
            R.juxt([
              R.view(R.lensPath(['game', 'nextTet'])),
              R.view(R.lensPath(['game', 'size']))
            ])
          )
        ],
        [
          matchAction('clearInput'),
          R.set(R.lensProp('input'), [])
        ],
        [
          matchAction('inpLR'),
          inputReducer('L')
        ],
        [
          matchAction('inpRR'),
          inputReducer('R')
        ],
        [
          matchAction('inpNextTet'),
          inputReducer('N')
        ],
        [
          matchAction('inpL'),
          inputReducer('<')
        ],
        [
          matchAction('inpR'),
          inputReducer('>')
        ],
        [
          matchAction('inpU'),
          inputReducer('^')
        ],
        [
          matchAction('inpD'),
          inputReducer('v')
        ],
        [
          matchAction('leftRot'),
          leftRot
        ],
        [
          matchAction('riteRot'),
          riteRot
        ],
        [
          matchAction('left'),
          left
        ],
        [
          matchAction('rite'),
          rite
        ],
        [
          matchAction('up'),
          up
        ],
        [
          matchAction('down'),
          R.set(
            R.lensPath(['game', 'actiTet', 'dropping']),
            true
          )
        ],
        [
          matchAction('drawActiTet'),
          drawActiTet
        ],
        [
          matchAction('reset'),
          resetReducer
        ],
        [
          matchAction('setBucket'),
          (state, action) =>
            R.set(
              R.lensPath(['game', 'bucket']),
              action.payload,
              state
            )
        ],
        [
          matchAction('toggleMatrixStyle'),
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
        ],
        [ R.T,
          (state, action) => {
            const actionType = action ? action.type : 'nil event'
            if ('@@redux/' !== R.take(8, actionType))
              Alert.alert('unexpected', `unknown event '${actionType}'`)
            return state
          }
        ]
      ])
  )(
    actionType => (state, action) =>
      R.compose(
        R.equals(actionType),
        R.prop('type')
      )(action)
  )
