import React from 'react'
import { useSelector } from 'react-redux'
import { createUseStyles, useTheme } from 'react-jss'
import * as R from 'ramda'

import NextBlo from './NextBlo'
import Score from './Score'
import Text from './Text'
import View from './View'

const useStyles = createUseStyles({
  scoreAndNext: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: R.path(['theme', 'scoreAndNextBlo', 'background']),
    paddingTop: 2,
    paddingBottom: 2,
  },
  gameOver: {
    flex: 3,
    color: R.path(['theme', 'scoreAndNextBlo', 'foreground']),
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
          ? (
            <Text className={styles.gameOver}>
              Game Over
            </Text>
          ) : <NextBlo />
      }
      <View className={styles.midPad} />
      <Score />
      <View className={styles.sidePad} />
    </View>
  )
}
