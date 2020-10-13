import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {useSelector} from 'react-redux'
import * as R from 'ramda'

import renameKeys from '../../fun/renameKeys'
import { tetset } from '../../tets'

import { block as blockTheme } from '../../theme.js'

const rawCommonBlockStyle = {
  flexGrow: 1,
  borderStyle: 'solid',
  borderWidth: 4,
  borderRadius: 4,
  opacity: 0.5
}

const annoBlockStyle = {
  fontFamily: 'VT323-Regular',
  fontWeight: '900',
  textAlign: 'center',
  paddingTop: 3
}

const blockStyleForEmpty = {
  borderColor: 'rgba(255, 255, 255, 0)',
  opacity: 0.3
}

const getBlockStyleForTetKind =
  R.compose(
    R.applySpec({
      backgroundColor: R.prop('primary'),
      color: R.prop('complement'),
      borderTopColor: R.prop('highlight'),
      borderRightColor: R.prop('shadow'),
      borderBottomColor: R.prop('shadow'),
      borderLeftColor: R.prop('highlight')
    }),
    R.flip(R.prop)(blockTheme)
  )

const blockStyles =
  R.compose(
    R.fromPairs,
    R.map(
      tetKind =>
        [
          tetKind,
          R.mergeLeft(
            getBlockStyleForTetKind(tetKind),
            rawCommonBlockStyle
          )
        ]
    )
  )(tetset)

const emptyBlockStyle =
  R.mergeLeft(
    blockStyleForEmpty,
    rawCommonBlockStyle
  )

const annoBlockStyles =
  R.compose(
    renameKeys(
      R.compose(
        R.fromPairs,
        R.map(
          tet => [tet, R.concat('a', tet)]
        )
      )(tetset)
    ),
    R.map(
      R.mergeLeft(annoBlockStyle)
    )
  )(blockStyles)

const emptyAnnoBlockStyle =
  R.mergeLeft(
    R.mergeRight(
      annoBlockStyle,
      {
        color: 'darkgrey'
      }
    ),
    emptyBlockStyle
  )

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-evenly'
  },
  background: {
    display: 'flex',
    flex: 1
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    height: '50%',
  },
  MT: emptyBlockStyle,
  aMT: emptyAnnoBlockStyle,
  ...blockStyles,
  ...annoBlockStyles
})

export default ({i, j}) => {
  const matrixStyle = useSelector(R.path(['style', 'matrix']))
  const tet = useSelector(R.path(['game', 'bucket', i, j]))

  const style =
    styles[
      R.compose(
        R.when(
          R.thunkify(R.equals(1))(matrixStyle),
          R.concat('a')
        ),
        R.when(
          R.equals(0),
          R.always('MT')
        )
      )(tet)
      ]

  return {
    0: () => (<View style={style}/>),
    1: () => (<Text style={style}>{tet}</Text>)
  }[matrixStyle]()
}
