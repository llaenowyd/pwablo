import React from 'react'

import {StyleSheet, View} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import makeRange from '../fun/makeRange'
import { getTetPoints, tetset } from '../tets'
import themes from '../themes'

import { BlockView } from './components/Block'

const themeName = 'arcade'
const {scoreAndNextTet: scoreAndNextTetTheme} = themes[themeName]

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 2,
    backgroundColor: scoreAndNextTetTheme.background
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  blocklet: {
    flex: 1
  },
  void: {
    flex: 1,
    padding: 2,
  }
})

const tetMeta = {
  I: [[[0,3], [0,2]], [1,1]],
  J: [[[0,2], [0,1]], [1,0]],
  L: [[[0,2], [0,1]], [1,0]],
  O: [[[0,1], [0,1]], [0,0]],
  S: [[[0,2], [0,1]], [1,0]],
  T: [[[0,2], [0,1]], [1,0]],
  Z: [[[0,2], [0,1]], [1,0]]
}

const tetlets =
  R.compose(
    R.indexBy(R.head),
    R.map(
      R.compose(
        ([tet, points, range, adj]) =>
          ((adjCol, adjRow) => [
            tet,
            R.map(
              ([i, j]) => [adjCol(i), adjRow(j)],
              points
            ),
            range
          ])(
            (
              R.add(adj[0])
            ),
            (
              R.add(adj[1])
            )
          ),
        tet => [tet, getTetPoints(tet), ...tetMeta[tet]]
      )
    )
  )(tetset)

const Blocklet = ({tetKind}) => (<BlockView matrixStyle={0} tetKind={tetKind} isCompleted={false} />)

export default props => {
  const tetKind = useSelector(R.path(['game', 'nextTet']))

  if (R.isNil(tetKind)) return (<View style={styles.void} />)

  const tetlet = tetlets[tetKind]

  const [cols, rows, tetPoints] =
    R.juxt([
      R.compose(R.add(1), R.defaultTo(2), R.path([2, 0, 1])),
      R.compose(R.add(1), R.defaultTo(2), R.path([2, 1, 1])),
      R.compose(R.defaultTo([]), R.nth(1))
    ])(tetlet)

  const isLit = (col, row) =>
      R.ifElse(
        R.thunkify(R.isNil)(tetKind),
        R.F,
        R.compose(
          R.not,
          R.equals(-1),
          R.findIndex(
            R.both(
              R.compose(
                R.equals(col),
                R.nth(0)
              ),
              R.compose(
                R.equals(row),
                R.nth(1)
              )
            )
          )
        )
      )(tetPoints)

  return (
    <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.view)}>
      {
        R.map(
          row => (
            <View key={row} style={styles.row}>
              {
                R.map(
                  col => (
                    <Blocklet
                      key={row * cols + col}
                      tetKind={isLit(col, row) ? tetKind : 0}
                    />
                  ),
                  makeRange(cols)
                )
              }
            </View>
          ),
          R.reverse(makeRange(rows))
        )
      }
    </View>
  )
}
