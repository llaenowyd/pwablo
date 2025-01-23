import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { View } from '../react-native-dummies';
import { actions } from '../state/actions'
import themes from '../themes'

import Controls from './Controls'
import KeyboardControls from './KeyboardControls'
import Matrix from './Matrix'
import ScoreAndNext from './ScoreAndNext'

const themeName = 'arcade'
const {background} = themes[themeName]

const useStyles = createUseStyles({
  view: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: background
  },
  scoreAndNext: {
  },
})

export default props => {
  const dispatch = useDispatch()

  const styles = useStyles()

  useEffect(() => {
    return () => dispatch({type: actions.stopTick})
  }, [dispatch])

  return (
    <View className={styles.view}>
      <ScoreAndNext />
      <Matrix />
      <Controls />
      <KeyboardControls />
    </View>
  )
}
