import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View,
} from 'react-native';

import * as R from 'ramda'

import thunks from '../state/thunks'
import Matrix from './Matrix'
import Controls from './Controls'

const styles = StyleSheet.create({
  view: {
    marginTop: 15,
    paddingBottom: 25,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#101010'
  },
  matrix: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto'
  },
  controls: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto'
  }
})

export default props => {
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(thunks.testPattern())
    return () => dispatch(thunks.stopTick())
  }, [])

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <Matrix style={styles.matrix} />
      <Controls style={styles.controls} />
    </View>
  )
}
