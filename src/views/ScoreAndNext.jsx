import React from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles, useTheme } from 'react-jss'

import * as R from 'ramda'

import { Text, View } from '../react-native-dummies'

import NextTet from './NextTet'
import Score from './Score'


const useStyles = createUseStyles({
  scoreAndNext: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: R.path(['theme', 'scoreAndNextTet', 'background']),
    paddingTop: 2,
    paddingBottom: 2,
  },
  gameOver: {
    flex: 3,
    color: R.path(['theme', 'scoreAndNextTet', 'foreground']),
    fontFamily: 'Early GameBoy',
    fontWeight: '900',
    fontSize: 12
  },
  midPad: {
    flex: 2,
  },
  sidePad: {
    flex: 2
  },
})

export default () => {
  const gameOver = useSelector(R.path(['game', 'finished']))

  const theme = useTheme()
  const styles = useStyles({theme})

  return (
    <View className={styles.scoreAndNext}>
      <View className={styles.sidePad} />
      {
        gameOver
          ? (<Text
               allowFontScaling={false}
               adjustsFontSizeToFit={true}
               className={styles.gameOver}
            >
              Game Over
            </Text>)
          : (<NextTet />)
      }
      <View className={styles.midPad} />
      <Score />
      <View className={styles.sidePad} />
    </View>
  )
}
