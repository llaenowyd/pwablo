import React from 'react'

import { createUseStyles, useTheme } from 'react-jss'

import * as R from 'ramda'

import { View } from '../../react-native-dummies'

import MuteButton from './MuteButton'
import NewGameButton from './NewGameButton'
import PatternButton from './PatternButton'
import ResetButton from './ResetButton'

const padding = 5

const useStyles = createUseStyles({
  gridView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: padding,
    paddingRight: padding,
    paddingLeft: padding,
    paddingBottom: 0,
    borderRadius: 4,
    backgroundColor: R.path(['theme', 'menu', 'background']),
    borderStyle: 'solid',
    borderColor: R.path(['theme', 'menu', 'borderColor']),
    borderWidth: '1px',
  },
  rowView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: R.path(['theme', 'menu', 'background']),
    borderStyle: 'solid',
    borderColor: R.path(['theme', 'menu', 'borderColor']),
    borderWidth: '1px',
    width: '100%',
    padding: '8px',
    gap: '8px',
    minHeight: '64px',
  },
  column: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  rowPad: {
    flex: 0.1,
  },
  columnPad: {
    flex: 0.25,
  },
  rightColumn: {
    marginLeft: padding,
  },
})

export default props => {
  const theme = useTheme()
  const styles = useStyles({props, theme})

  return props.row ? (
    <View className={styles.rowView}>
      <MuteButton />
      <ResetButton />
      <PatternButton />
      <NewGameButton />
    </View>
  ) : (
    <View className={styles.gridView}>
      <View className={styles.rowPad} />
      <View className={styles.column}>
        <View className={styles.columnPad} />
        <MuteButton />
        <ResetButton />
        <View className={styles.columnPad} />
      </View>
      <View className={[styles.column, styles.rightColumn].join(' ')}>
        <View className={styles.columnPad} />
        <PatternButton />
        <NewGameButton />
        <View className={styles.columnPad} />
      </View>
      <View className={styles.rowPad} />
    </View>
  )
}
