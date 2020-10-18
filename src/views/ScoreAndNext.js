import React from 'react'

import { StyleSheet, View } from 'react-native'

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
    flex: 2
  }
})

export default props => {
  return (
    <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.view)}>
      <View style={styles.sidePad} />
      <NextTet style={styles.nextTet} />
      <View style={styles.midPad} />
      <Score style={styles.score} />
      <View style={styles.sidePad} />
    </View>
  )
}
