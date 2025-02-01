import React from 'react'

import { useDispatch } from 'react-redux'

import { createUseStyles, useTheme } from 'react-jss'

import * as R from 'ramda'

import { View } from '../../react-native-dummies'
import { actions } from '../../state/actions'

import LittleButtonCluster from '../LittleButtonCluster'
import MainButton from './MainButton'


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
  controls: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: R.path(['theme', 'controls', 'background']),
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
    justifyContent: 'center',
  },
  leftBumper: R.mergeLeft(basicJss.bumper, basicJss.leftBumper),
  rightBumper: R.mergeLeft(basicJss.bumper, basicJss.rightBumper),
})

export default () => {
  const dispatch = useDispatch()

  const handleLeftRotateClick = () => dispatch({type: actions.inpLR})
  const handleRightRotateClick = () => dispatch({type: actions.inpRR})
  const handleLeftClick = () => dispatch({type: actions.inpL})
  const handleRightClick = () => dispatch({type: actions.inpR})
  const handleDownClick = () => dispatch({type: actions.inpD})

  const theme = useTheme()
  const styles = useStyles({theme})

  return (
    <View className={styles.controls}>
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
