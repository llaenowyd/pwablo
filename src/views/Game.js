import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as R from 'ramda'

import thunks from '../state/thunks'
import GameBoard from './GameBoard'
import Matrix from './Matrix'
import NextPiece from './NextPiece'

const styles = StyleSheet.create({
  game: {
  },
  matrix: {
    height: '100%',
    padding: 3
  },
  nextPiece: {
    margin: 10
  }
})
  // <GameBoard />
  // <NextPiece style={styles.nextPiece}/>
  // <Matrix rows={20} cols={10} style={styles.matrix} />

export default props => {
  const dispatch = useDispatch()

  const handleNextClick = () => dispatch({
    type: 'nextPiece',
    payload: { }
  })

  const handleTestPatternClick = () => dispatch(thunks.doTestPattern())

  const handleResetClick = () => dispatch({
    type: 'reset',
    payload: { }
  })

  const handleToggleStyleClick = () => dispatch({
    type: 'toggleMatrixStyle',
    payload: { }
  })

  return (
    <>
      <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.game)}>
        <Matrix style={styles.matrix} />
      </View>
      <Button
        title="test pattern"
        onPress={handleTestPatternClick}
      />
      <Button
        title="toggle style"
        onPress={handleToggleStyleClick}
      />
      <Button
        title="reset"
        onPress={handleResetClick}
      />
    </>
  )
}
