import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import themes from '../themes'

import NextTet from './NextTet'
import Score from './Score'

const themeName = 'arcade'
const {scoreAndNextTet: scoreAndNextTetTheme} = themes[themeName]

const styles = StyleSheet.create({
  view: {
    flex: 1,
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
  nextTet: {
    flex: 1
  },
  score: {
    flex: 5
  }
})

export default props => {
  const gameOver = useSelector(R.path(['game', 'finished']))

  return (
    <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.view)}>
      <View style={styles.sidePad} />
      {
        gameOver
          ? (<Text
               allowFontScaling={false}
               adjustsFontSizeToFit={true}
               style={styles.gameOver}
            >
              Game Over
            </Text>)
          : (<NextTet style={styles.nextTet} />)
      }
      <View style={styles.midPad} />
      <Score style={styles.score} />
      <View style={styles.sidePad} />
    </View>
  )
}
