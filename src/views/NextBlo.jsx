import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createUseStyles, useTheme } from 'react-jss'
import * as R from 'ramda'

import { MT, getBloPoints, bloset } from '~/blo'
import constants from '~/constants'
import range from '~/range'

import { useGetBlockClassName } from './Block'
import BlockView from './Block/BlockView'
import View from './View'

const useStyles = createUseStyles({
  view: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 2,
    backgroundColor: R.path(['theme', 'scoreAndNextBlo', 'background']),
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  blocklet: {
    flex: 1,
  },
  void: {
    flex: 1,
    padding: 2,
  },
})

const bloMeta = {
  I: [[[0,3], [0,2]], [1,1]],
  J: [[[0,2], [0,1]], [1,0]],
  L: [[[0,2], [0,1]], [1,0]],
  O: [[[0,1], [0,1]], [0,0]],
  S: [[[0,2], [0,1]], [1,0]],
  T: [[[0,2], [0,1]], [1,0]],
  Z: [[[0,2], [0,1]], [1,0]],
}

const blolets =
  R.compose(
    R.indexBy(R.head),
    R.map(
      R.compose(
        ([blo, points, range, adj]) =>
          ((adjCol, adjRow) => [
            blo,
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
        blo => [blo, getBloPoints(blo), ...bloMeta[blo]]
      )
    )
  )(bloset)

export default () => {
  const bloKind = useSelector(R.path(['game', 'nextBlo']))
  const getBlockClassName = useGetBlockClassName(constants.matrixStyle.default, true)

  const mtBlockClassName = useMemo(
    R.thunkify(getBlockClassName)(MT),
    [getBlockClassName]
  )
  const blockClassName = useMemo(
    R.thunkify(getBlockClassName)(bloKind),
    [bloKind, getBlockClassName]
  )

  const theme = useTheme()
  const styles = useStyles({theme})

  if (R.isNil(bloKind)) return (<View className={styles.void} />)

  const blolet = blolets[bloKind]

  const [cols, rows, bloPoints] =
    R.juxt([
      R.compose(R.add(1), R.defaultTo(2), R.path([2, 0, 1])),
      R.compose(R.add(1), R.defaultTo(2), R.path([2, 1, 1])),
      R.compose(R.defaultTo([]), R.nth(1))
    ])(blolet)

  const isLit = (col, row) =>
      R.ifElse(
        R.thunkify(R.equals(MT))(bloKind),
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
      )(bloPoints)

  return (
    <View className={styles.view}>
      {
        R.map(
          row => (
            <View key={row} className={styles.row}>
              {
                R.map(
                  col => (
                    <BlockView
                      key={row * cols + col}
                      bloKind={isLit(col, row) ? bloKind : MT}
                      className={isLit(col, row) ? blockClassName : mtBlockClassName}
                      matrixStyle={constants.matrixStyle.default}
                      isCompleted={false}
                      mini />
                  ),
                  range(cols)
                )
              }
            </View>
          ),
          R.reverse(range(rows))
        )
      }
    </View>
  )
}
