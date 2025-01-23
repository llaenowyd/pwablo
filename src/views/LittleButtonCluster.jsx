import React from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { View } from '../react-native-dummies';
import { actions } from '../state/actions'
import thunks from '../state/thunks'
import themes from '../themes'

import LittleButton from './components/LittleButton'

const themeName = 'arcade'
const {menu:menuTheme} = themes[themeName]

const padding = 5

const useStyles = createUseStyles({
  view: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: padding,
    paddingRight: padding,
    paddingLeft: padding,
    paddingBottom: 0,
    borderRadius: 4,
    backgroundColor: menuTheme.background,
    borderStyle: 'solid',
    borderColor: menuTheme.borderColor,
    borderWidth: '1px',
  },
  column: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-evenly'
  },
  rowPad: {
    flex: 0.1
  },
  columnPad: {
    flex: 0.25
  },
  rightColumn: {
    marginLeft: padding
  },
})

const LittleButtonCluster = props => {
  const dispatch = useDispatch()

  const musicEnabled = useSelector(R.path(['audio', 'music', 'enabled']))

  const handleTestPatternClick = () => dispatch(thunks.testPattern())
  const handleNewGameClick = () => {
    dispatch(thunks.newGame())
  }
  const handleResetClick = () => {
    dispatch({type: actions.reset})
  }

  const handleToggleMusicClick = () => dispatch({
    type: actions.toggleMusic
  })

  const styles = useStyles()

  return (
    <View className={styles.view}>
      <View className={styles.rowPad} />
      <View className={styles.column}>
        <View className={styles.columnPad} />
        <LittleButton
          text={musicEnabled?'mute':'song'}
          onPress={handleToggleMusicClick}
        />
        <LittleButton
          text="reset"
          onPress={handleResetClick}
        />
        <View className={styles.columnPad} />
      </View>
      <View className={[styles.column, styles.rightColumn].join(' ')}>
        <View className={styles.columnPad} />
        <LittleButton
          text="pattern"
          onPress={handleTestPatternClick}
        />
        <LittleButton
          text="new game"
          onPress={handleNewGameClick}
        />
        <View className={styles.columnPad} />
      </View>
      <View className={styles.rowPad} />
    </View>
  )
}

export default LittleButtonCluster
