import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { createUseStyles } from 'react-jss'
import * as R from 'ramda'

import constants from '../../constants'
import BlockView from './BlockView'
import blockStyles from './static-theme'

export const useBlockStyles = createUseStyles(blockStyles)

export const useGetBlockClassName = (matrixStyle, mini) => {
  const blockStyles = useBlockStyles()

  return useCallback(
    R.cond([
      [
        R.nth(1),
        ([,,blockStyles]) => tk => blockStyles[`mini${tk}`]
      ],
      [
        R.compose(
          R.equals(constants.matrixStyle.annotated),
          R.head
        ),
        ([,,blockStyles]) => tk => blockStyles[`anno${tk}`]
      ],
      [
        R.T,
        ([,,blockStyles]) => tk => blockStyles[tk]
      ]
    ])([matrixStyle, mini, blockStyles]),
       [matrixStyle, mini, blockStyles])
}

export default ({i, j, getBlockClassName, matrixStyle}) => {
  const tetKind = useSelector(R.path(['game', 'bucket', i, j]))

  return <BlockView className={getBlockClassName(tetKind)} tetKind={tetKind} matrixStyle={matrixStyle} />
}
