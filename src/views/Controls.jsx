import React from 'react'

import { useDispatch } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { View } from '../react-native-dummies'
import { actions } from '../state/actions'
import themes from '../themes'

import LittleButtonCluster from './LittleButtonCluster'
import MainButton from './components/MainButton'

const themeName = 'arcade'
const {controls:controlsTheme} = themes[themeName]

const basicJss = {
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
}

const useStyles = createUseStyles({
  view: {
    flex: 6,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: controlsTheme.background,
    paddingBottom: 10
  },
  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingTop: 10
  },
  center: {
    flex: 3,
    display: 'flex',
  },
  leftBumper: R.mergeLeft(basicJss.bumper, basicJss.leftBumper),
  rightBumper: R.mergeLeft(basicJss.bumper, basicJss.rightBumper),
})

const Controls = () => {
  const dispatch = useDispatch()

  const handleLeftRotateClick = () => dispatch({type: actions.inpLR})
  const handleRightRotateClick = () => dispatch({type: actions.inpRR})
  const handleLeftClick = () => dispatch({type: actions.inpL})
  const handleRightClick = () => dispatch({type: actions.inpR})
  const handleDownClick = () => dispatch({type: actions.inpD})

  const styles = useStyles()

  return (
    <View className={styles.view}>
      <View className={styles.row}>
        <View className={styles.leftBumper}>
          <MainButton
            icon="rotr"
            onPress={handleLeftRotateClick}
          />
        </View>
        <View className={styles.center}>
          <LittleButtonCluster />
        </View>
        <View className={styles.rightBumper}>
          <MainButton
            icon="rotl"
            onPress={handleRightRotateClick}
          />
        </View>
      </View>
      <View className={styles.row}>
        <View className={styles.leftBumper}>
          <MainButton
            icon="left"
            onPress={handleLeftClick}
          />
        </View>
        <View className={styles.center}>
          <MainButton
            icon="down"
            onPress={handleDownClick}
          />
        </View>
        <View className={styles.rightBumper}>
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
