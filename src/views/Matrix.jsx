import React, { useCallback, useMemo } from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import constants from '../constants'
import { carousel, idleBackground } from '../images'
import range from '../range'
import { View } from '../react-native-dummies'

import Block, { useGetBlockClassName } from './Block'
import ImageBackground from './ImageBackground'

const useStyles = createUseStyles({
  matrix: {
    flex: 1,
    aspectRatio: constants.aspectRatio.matrix,
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '100%',
    maxHeight: '100%',
    height: 'fit-content',
    alignItems: 'stretch',
  },
  background: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    maxWidth: '100%',
  },
})

const Matrix = () => {
  const tickMode = useSelector(R.path(['tick', 'mode']))
  const [ cols, rows ] = useSelector(R.path(['game', 'size']))
  const completedRows = useSelector(R.path(['game', 'completedRows']))
  const gameLevel = useSelector(R.path(['game', 'level']))
  const matrixStyle = useSelector(R.path(['style', 'matrix']))
  const getBlockClassName = useGetBlockClassName(matrixStyle, false)

  const styles = useStyles()

  const background = useMemo(
    R.thunkify(
      R.ifElse(
        R.compose(
          R.equals('game'),
          R.head
        ),
        R.chain(
          R.compose(
            R.curryN(2, R.compose)(
              R.__,
              R.nth(2)
            ),
            R.nth
          ),
          R.compose(
            R.apply(R.modulo),
            R.juxt([
              R.compose(
                R.add(-1),
                R.nth(1)
              ),
              R.compose(
                R.length,
                R.nth(2)
              )
            ])
          )
        ),
        R.nth(3)
      )
    )([tickMode, gameLevel, carousel, idleBackground]),
      [tickMode, gameLevel, carousel, idleBackground])

  const getIsCompleted = useCallback(
    R.ifElse(
      R.isEmpty,
      R.always(R.F),
      R.always(R.compose(
        R.not,
        R.isNil,
        R.flip(R.find)(completedRows),
        R.equals
      ))
    )(completedRows), [completedRows])

  return (
    <View className={styles.matrix}>
      <ImageBackground source={background} className={styles.background}>
        {
          R.map(
            row => (
              <View key={row} className={styles.row}>
                {
                  R.map(
                    col => (
                      <Block
                        key={row * cols + col}
                        i={col}
                        j={row}
                        getBlockClassName={getBlockClassName}
                        isCompleted={getIsCompleted(row)}
                      />
                    ),
                    range(cols)
                  )
                }
              </View>
            ),
            R.reverse(range(rows))
          )
        }
      </ImageBackground>
    </View>
  )
}

export default Matrix
