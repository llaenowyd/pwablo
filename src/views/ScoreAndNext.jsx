import React from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { Text, View } from '../react-native-dummies'
import themes from '../themes'

import NextTet from './NextTet'
import Score from './Score'

const themeName = 'arcade'
const {scoreAndNextTet: scoreAndNextTetTheme} = themes[themeName]

const useStyles = createUseStyles({
  view: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: scoreAndNextTetTheme.background,
    paddingTop: 2,
    paddingBottom: 2
  },
  gameOver: {
    flex: 3,
    color: scoreAndNextTetTheme.foreground,
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

  const styles = useStyles()

  return (
    <View className={styles.view}>
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
