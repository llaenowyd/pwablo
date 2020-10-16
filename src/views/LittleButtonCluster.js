import React from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View
} from 'react-native';

import * as R from 'ramda'

import { actions } from '../state/actions'
import thunks from '../state/thunks'
import themes from '../themes'

const themeName = 'arcade'
const {menu:menuTheme} = themes[themeName]

import Presser from './components/Presser'

const padding = 5

const styles = StyleSheet.create({
  view: {
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
    borderWidth: StyleSheet.hairlineWidth
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
  littleButton: {
    flex: 1,
    marginBottom: padding,
    borderColor: menuTheme.button.borderColor
  },
  littleButtonPressed: {
    backgroundColor: menuTheme.buttonActive.background,
    color: menuTheme.buttonActive.foreground
  },
  littleButtonUnpressed: {
    backgroundColor: menuTheme.button.background,
    color: menuTheme.button.foreground
  }
})

const LittleButton = props => (
  <Presser
    style={styles.littleButton}
    stylePressed={styles.littleButtonPressed}
    styleUnpressed={styles.littleButtonUnpressed}
    text={props.text}
    onPress={props.onPress}
  />
)

const LittleButtonCluster = props => {
  const dispatch = useDispatch()

  const handleTestPatternClick = () => dispatch(thunks.testPattern())
  const handleNewGameClick = () => {
    dispatch(thunks.newGame())
  }
  const handleResetClick = () => {
    dispatch({type: actions.reset})
  }

  const handleToggleStyleClick = () => dispatch({
    type: actions.toggleMatrixStyle,
    payload: { }
  })

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <View style={styles.rowPad} />
      <View style={styles.column}>
        <View style={styles.columnPad} />
        <LittleButton
          text="grid"
          onPress={handleToggleStyleClick}
        />
        <LittleButton
          text="reset"
          onPress={handleResetClick}
        />
        <View style={styles.columnPad} />
      </View>
      <View style={[styles.column, styles.rightColumn]}>
        <View style={styles.columnPad} />
        <LittleButton
          text="pattern"
          onPress={handleTestPatternClick}
        />
        <LittleButton
          text="new game"
          onPress={handleNewGameClick}
        />
        <View style={styles.columnPad} />
      </View>
      <View style={styles.rowPad} />
    </View>
  )
}

export default LittleButtonCluster
