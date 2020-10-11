import React from 'react'

import {
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import makeRange from '../fun/makeRange'
import renameKeys from '../fun/renameKeys'
import { palette, tetset } from '../tets'

import { savior } from '../Images'

const rawCommonBlockStyle = {
  flexGrow: 1,
  borderStyle: 'solid',
  borderWidth: 4,
  borderRadius: 4,
  opacity: 0.5
}

const rawAnnoBlockStyle = {
  fontFamily: 'VT323-Regular',
  fontWeight: '900',
  textAlign: 'center',
  paddingTop: 3
}

const rawBlockStyles =
  R.compose(
    R.fromPairs,
    R.map(
      tet =>
        [
          tet,
          R.compose(
            R.mergeLeft(rawCommonBlockStyle),
            R.applySpec({
              backgroundColor: R.path(['primary', tet]),
              color: R.path(['complement', tet]),
              borderTopColor: R.path(['highlight', tet]),
              borderRightColor: R.path(['shadow', tet]),
              borderBottomColor: R.path(['shadow', tet]),
              borderLeftColor: R.path(['highlight', tet])
            })
          )(palette)
        ]
    )
  )(tetset)

const rawEmptyBlockStyle =
  R.mergeLeft(
    rawCommonBlockStyle,
    {
      borderColor: 'rgba(255, 255, 255, 0)',
      opacity: 0.3
    }
  )

const rawAnnoBlockStyles =
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
      R.mergeLeft(rawAnnoBlockStyle)
    )
  )(rawBlockStyles)

const rawEmptyAnnoBlockStyle =
  R.mergeLeft(
    R.mergeRight(
      rawAnnoBlockStyle,
      {
        color: 'darkgrey'
      }
    ),
    rawEmptyBlockStyle
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
  MT: rawEmptyBlockStyle,
  aMT: rawEmptyAnnoBlockStyle,
  ...rawBlockStyles,
  ...rawAnnoBlockStyles
})

const Block = ({i, j}) => {
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

const Matrix = props => {
  const [ cols, rows ] = useSelector(R.path(['game', 'size']))

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <ImageBackground source={savior} style={styles.background}>
        {
          R.map(
            row => (
              <View key={row} style={styles.row}>
                {
                  R.map(
                    col => (<Block key={row*cols+col} i={col} j={row} />),
                    makeRange(cols)
                  )
                }
              </View>
            ),
            R.reverse(makeRange(rows))
          )
        }
      </ImageBackground>
    </View>
  )
}

export default Matrix
