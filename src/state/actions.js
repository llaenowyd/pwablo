import * as R from 'ramda'

const actionNames = {
  setTick: 'setTick',
  stopTick: 'stopTick',
  clockTick: 'clockTick',
  fall: 'fall',
  fallIfFalling: 'fallIfFalling',
  setNextTet: 'setNextTet',
  useNextTet: 'useNextTet',
  clearInput: 'clearInput',
  inpLR: 'inpLR',
  inpRR: 'inpRR',
  inpL: 'inpL',
  inpR: 'inpR',
  inpU: 'inpU', // unused
  inpD: 'inpD',
  leftRot: 'leftRot',
  riteRot: 'riteRot',
  left: 'left',
  rite: 'rite',
  up: 'up',
  down: 'down',
  clearCompletedRows: 'clearCompletedRows',
  drawActiTet: 'drawActiTet',
  reset: 'reset',
  setBucket: 'setBucket',
  toggleMatrixStyle: 'toggleMatrixStyle'
}

export const actions =
  R.compose(
    R.fromPairs,
    R.chain(
      ids => keys => R.transpose([keys, ids]),
      R.compose(
        R.times(R.identity),
        R.length
      )
    ),
    R.keys
  )(actionNames)

const reverseLookup =
  R.compose(
    R.fromPairs,
    R.map(([k,v]) => [v,k]),
    R.toPairs
  )(actions)

export const getActionName = actionId => reverseLookup[actionId]
