import * as R from 'ramda'

import { blueGetRandomBlokind } from '~/random'

import { actions } from '../../actions'

// tbd
const setNextBlo = (dispatch, getState) =>
  R.compose(
    nextBlo => dispatch({type: actions.setNextBlo, payload: nextBlo}),
    blueGetRandomBlokind,
    R.path(['game', 'bag'])
  )(getState())

// tbd
const useNextBlo = (dispatch, getState) => {
  dispatch({type: actions.useNextBlo})
  return setNextBlo(dispatch, getState)
}

const handleInput = (dispatch, getState) => {
  const {input} = getState()

  if (R.length(input) === 0) return

  const doLeftRot = R.isNotNil(R.find(R.equals('L'), input))
  const doRiteRot = R.isNotNil(R.find(R.equals('R'), input))
  const doLeft = R.isNotNil(R.find(R.equals('<'), input))
  const doRite = R.isNotNil(R.find(R.equals('>'), input))
  const doDown = R.isNotNil(R.find(R.equals('v'), input))

  if (doLeftRot) dispatch({type: actions.leftRot})
  if (doRiteRot) dispatch({type: actions.riteRot})
  if (doLeft) dispatch({type: actions.left})
  if (doRite) dispatch({type: actions.rite})
  if (doDown) dispatch({type: actions.down})

  dispatch({type: actions.clearInput})
}

/**
 * blueGame
 */
export default (dispatch, getState) => {
  const dispatchTable = R.mergeLeft(
    R.compose(
      R.fromPairs,
      R.map(R.compose(
        R.adjust(1, R.compose(
          R.thunkify(dispatch),
          R.objOf('type'),
          R.flip(R.prop)(actions)
        )),
        R.flip(R.repeat)(2)
      ))
    )([
      'clearCompletedRows',
      'clockTick',
      'fall',
      'fallIfFalling',
    ]),
    R.map(R.compose(
        f => f(dispatch, getState),
        R.thunkify
    ))({
      handleInput,
      setNextBlo,
      useNextBlo,
    })
  )

  R.forEach(R.applyTo(R.prop('game', getState())), [
    R.when(
      R.compose(R.isNil, R.prop('nextBlo')),
      dispatchTable.setNextBlo
    ),
    R.when(
      R.compose(R.isNotEmpty, R.prop('completedRows')),
      dispatchTable.clearCompletedRows
    ),
    R.when(
      R.compose(R.isNil, R.path(['actiBlo', 'kind'])),
      dispatchTable.useNextBlo
    ),
    dispatchTable.handleInput,
    R.ifElse(
      R.compose(R.equals(0), R.prop('clock')),
      dispatchTable.fall,
      dispatchTable.fallIfFalling
    ),
    dispatchTable.clockTick,
  ])
}
