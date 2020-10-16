import React from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View
} from 'react-native';

import * as R from 'ramda'

import LittleButtonCluster from './LittleButtonCluster'
import IconPresser from './components/IconPresser'

import { actions } from '../state/actions'
import themes from '../themes'

const themeName = 'arcade'
const {controls:controlsTheme} = themes[themeName]

const styles = StyleSheet.create({
  view: {
    backgroundColor: controlsTheme.background,
    paddingBottom: 10
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 10
  },
  bumper: {
    flex: 1,
    alignItems: 'stretch'
  },
  leftBumper: {
    marginLeft: 5,
    marginRight: 10
  },
  rightBumper: {
    marginRight: 5,
    marginLeft: 10
  },
  center: {
    flex: 3
  },
  littleCluster: {
    flex: 1
  },
  mainButton: {
    flex: 1,
    borderColor: controlsTheme.button.borderColor,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderRadius: 5
  },
  buttonPressed: {
    backgroundColor: controlsTheme.buttonActive.background
  },
  buttonUnpressed: {
    backgroundColor: controlsTheme.button.background
  },
  buttonIcon: {
    fontSize: 55
  },
  buttonIconPressed: {
    color: controlsTheme.buttonActive.foreground
  },
  buttonIconUnpressed: {
    color: controlsTheme.button.foreground
  }
})

const MainButton = props => {
  return (
    <IconPresser
      style={R.mergeLeft(styles.mainButton, props.style)}
      stylePressed={styles.buttonPressed}
      styleUnpressed={styles.buttonUnpressed}
      iconStyle={styles.buttonIcon}
      iconStylePressed={styles.buttonIconPressed}
      iconStyleUnpressed={styles.buttonIconUnpressed}
      icon={props.icon}
      onPress={props.onPress}
    />
  )
}

const Controls = props => {
  const dispatch = useDispatch()

  const handleLeftRotateClick = () => dispatch({type: actions.inpLR})
  const handleRightRotateClick = () => dispatch({type: actions.inpRR})
  const handleLeftClick = () => dispatch({type: actions.inpL})
  const handleRightClick = () => dispatch({type: actions.inpR})
  const handleDownClick = () => dispatch({type: actions.inpD})

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <View style={styles.row}>
        <View style={R.mergeLeft(styles.bumper, styles.leftBumper)}>
          <MainButton
            icon="rotl"
            onPress={handleLeftRotateClick}
          />
        </View>
        <View style={styles.center}>
          <LittleButtonCluster style={styles.littleCluster} />
        </View>
        <View style={R.mergeLeft(styles.bumper, styles.rightBumper)}>
          <MainButton
            icon="rotr"
            onPress={handleRightRotateClick}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={R.mergeLeft(styles.bumper, styles.leftBumper)}>
          <MainButton
            icon="left"
            onPress={handleLeftClick}
          />
        </View>
        <View style={styles.center}>
          <MainButton
            icon="down"
            onPress={handleDownClick}
          />
        </View>
        <View style={R.mergeLeft(styles.bumper, styles.rightBumper)}>
          <MainButton
            icon="right"
            onPress={handleRightClick}
          />
        </View>
      </View>
    </View>
  )
}

export default Controls
