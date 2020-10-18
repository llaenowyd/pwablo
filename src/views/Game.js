import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View
} from 'react-native';

import * as R from 'ramda'

import ScoreAndNext from './ScoreAndNext'
import Matrix from './Matrix'
import Controls from './Controls'

import { actions } from '../state/actions'
import themes from '../themes'

const themeName = 'arcade'
const {background} = themes[themeName]

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    flex: 1,
    backgroundColor: background
  },
  scoreAndNext: {
    flex: 1
  },
  matrix: {
    flex: 24
  },
  controls: {
    flex: 6
  }
})

export default props => {
  const dispatch = useDispatch()

  useEffect(() => {
    return () => dispatch({type: actions.stopTick})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <ScoreAndNext style={styles.scoreAndNext} />
      <Matrix style={styles.matrix} />
      <Controls style={styles.controls} />
    </View>
  )
}
