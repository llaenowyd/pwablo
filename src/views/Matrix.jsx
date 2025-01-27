import React, { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import constants from '../constants'
import dbg from '../dbg'
import makeRange from '../fun/makeRange'
import { carousel, idleBackground } from '../Images'
import { ImageBackground, View } from '../react-native-dummies'

import Block, { useGetBlockClassName } from './Block'

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
    justifyContent: 'space-evenly',
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

  const background =
    tickMode !== 'game'
      ? idleBackground
      : carousel[(gameLevel - 1) % R.length(carousel)]

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
    )(dbg.T('completedRows')(completedRows)), [completedRows])

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
                        isCompleted={dbg.T(`isCompleted(${row}) col=${col}`)(getIsCompleted(row))}
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
      </ImageBackground>
    </View>
  )
}

export default Matrix
