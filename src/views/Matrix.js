import React, { useMemo } from 'react'

import {
  Alert,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import makeRange from '../fun/makeRange'
import { palette } from '../tets'

const styles = StyleSheet.create({
  view: {
    position: 'relative',
    backgroundColor: 'lightgrey'
  },
  matrix: {
    display: 'flex',
    flex: 1
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  cell: {
    flexGrow: 1,
    borderStyle: 'solid',
    borderWidth: 4,
    borderRadius: 4,
  },
  emptyCell: {
    flexGrow: 1,
    borderStyle: 'solid',
    borderWidth: 4,
    borderRadius: 4,
    borderColor: 'lightgrey'
, },
  text: {
    fontFamily: 'VT323-Regular',
    fontWeight: '900',
    textAlign: 'center',
    paddingTop: 3
  }
})

const blockStyles = StyleSheet.create(
  R.compose(
    R.assoc(0, styles.emptyCell),
    R.fromPairs,
    R.map(
      tet =>
        [
          tet,
          R.compose(
            R.mergeLeft(styles.cell),
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
  )(['I','J','L','O','S','T','Z'])
)
const getAnnotatedStyles = R.once(
  () =>
    R.map(
      R.mergeLeft(styles.text),
      blockStyles
    )
)

const Cell = ({i, j}) => {
  const matrixStyle = useSelector(R.path(['style', 'matrix']))
  const tet = useSelector(R.path(['game', 'bucket', i, j]))

  return R.flip(R.prop)({
    0: (<View style={blockStyles[tet]} />),
    1: (<Text style={getAnnotatedStyles()[tet]}>{tet}</Text>)
  })(matrixStyle)
}

const CellStyle0 = ({i, j}) => {
  const tet = useSelector(R.path(['game', 'bucket', i, j]))

  return (
    <View style={blockStyles[tet]} />
  )
}

const CellStyle1 = ({i, j}) => {
  const annotatedStyles = getAnnotatedStyles()

  const tet = useSelector(R.path(['game', 'bucket', i, j]))

  return (
    <Text style={annotatedStyles[tet]}>{tet}</Text>
  )
}

const Matrix = props => {
  const [ rows, cols ] = useSelector(R.path(['game', 'size']))

  return (
    <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.view)}>
      {
        R.map(
          row => (
            <View key={row} style={styles.row}>
              {
                R.map(
                  col => (<Cell key={row*cols+col} i={col} j={row} />),
                  makeRange(cols)
                )
              }
            </View>
          ),
          makeRange(rows)
        )
      }
    </View>
  )
}
/*

                          <View key={row*cols+col} style={blockStyles[tet]}>
                            <Text style={R.mergeLeft(styles.text, blockStyles[tet])}>{tet}</Text>
                          </View>
 */

export default Matrix
