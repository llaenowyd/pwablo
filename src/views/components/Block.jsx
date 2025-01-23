import React from 'react'
import { useSelector } from 'react-redux'
import { createUseStyles } from 'react-jss'
import * as R from 'ramda'

import renameKeys from '../../fun/renameKeys'
import { Animated } from '../../react-native-dummies'
import { tetset } from '../../tets'
import themes from '../../themes.js'

const themeName = 'arcade'
const {blocks:blockTheme, emptyBlock:emptyBlockTheme} = themes[themeName]

const commonBlockStyle = {
  // flexGrow: 1,
  flex: 1,
  borderStyle: 'solid',
  borderWidth: 4,
  borderRadius: 4,
  minWidth: '1vw',
  minHeight: '1vw',
}

const miniBlockStyle = {
  minWidth: '0.25vw',
  minHeight: '0.25vw',
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
            commonBlockStyle
          )
        ]
    )
  )(tetset)

  const miniBlockStyles =
    R.compose(
      renameKeys(
        R.compose(
          R.fromPairs,
          R.map(
            tet => [tet, R.concat('m', tet)]
          )
        )(tetset)
      ),
      R.fromPairs,
      R.map(
        tetKind =>
          [
            tetKind,
            R.mergeLeft(
              getBlockStyleForTetKind(tetKind),
              R.mergeLeft(
                miniBlockStyle,
                commonBlockStyle
              )
            )
          ]
      )
    )(tetset)

const emptyBlockStyle =
  R.mergeLeft(
    blockStyleForEmpty,
    commonBlockStyle
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
        color: emptyBlockTheme.complement
      }
    ),
    emptyBlockStyle
  )

const useStyles = createUseStyles({
  MT: emptyBlockStyle,
  aMT: emptyAnnoBlockStyle,
  ...blockStyles,
  ...miniBlockStyles,
  ...annoBlockStyles
})

export const BlockView =
  ({matrixStyle, tetKind, isCompleted, flashTimer}) => {
    const styles = useStyles()

    const styleKey =
      R.compose(
        R.when(
          R.thunkify(R.equals(1))(matrixStyle),
          R.concat('a')
        ),
        R.when(
          R.equals(0),
          R.always('MT')
        )
      )(tetKind)

    const blockStyle = styles[styleKey]

    const opacity = isCompleted && flashTimer ? {
      opacity: flashTimer
    } : {
      opacity: 1
    }

    return {
      0: () => (
        <Animated.View className={blockStyle} style={opacity} />
      ),
      1: () => (
        <Animated.Text allowFontScaling={false} className={blockStyle} style={opacity}>
          {tetKind}
        </Animated.Text>
      )
    }[matrixStyle]()
  }

export default ({i, j, isCompleted}) => {
  const matrixStyle = useSelector(R.path(['style', 'matrix']))
  const tetKind = useSelector(R.path(['game', 'bucket', i, j]))
  const flash = useSelector(R.path(['game', 'flash', j]))

  const flashTimer = flash.timer

  return (
    <BlockView
      matrixStyle={matrixStyle}
      tetKind={tetKind}
      isCompleted={isCompleted}
      flashTimer={flashTimer}
    />
  )
}
