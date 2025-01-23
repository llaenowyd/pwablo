import React from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import makeRange from '../fun/makeRange'
import { carousel, idleBackground } from '../Images'
import { ImageBackground, View } from '../react-native-dummies'

import Block from './components/Block'

const useStyles = createUseStyles({
  view: {
    flex: 24,
    display: 'flex',
    flexDirection: 'column',
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

  const styles = useStyles()

  const background =
    tickMode !== 'game'
      ? idleBackground
      : carousel[(gameLevel - 1) % R.length(carousel)]

  const getIsCompleted =
    R.isEmpty(completedRows)
      ? R.F :
      R.compose(
        R.not,
        R.isNil,
        R.flip(R.find)(completedRows),
        R.equals
      )

  return (
    <View className={styles.view}>
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
                        isCompleted={getIsCompleted(row)}
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
