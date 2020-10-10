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
import Matrix from './Matrix'
import { default as CustomButton } from './components/Button'

const styles = StyleSheet.create({
  game: {
    backgroundColor: 'palegoldenrod'
  },
  button: {
    margin: 2,
    flexGrow: 1,
    flexShrink: 1,
    height: 20,
    padding: 0
  },
  buttonText: {
    fontFamily: 'VT323-Regular',
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '900'
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginLeft: 32,
    marginRight: 32
  },
  matrix: {
    height: '100%',
    padding: 3
  }
})

const Presser = ({text, onPress}) => (
  <CustomButton
    style={styles.button}
    textStyle={styles.buttonText}
    text={text}
    onPress={onPress}
  />
)

export default props => {
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(thunks.stopTick()), [])

  const handleTestPatternClick = () => dispatch(thunks.testPattern())

  const handleNewGameClick = () => dispatch(thunks.newGame())

  const handleResetClick = () => dispatch(thunks.reset())

  const handleToggleStyleClick = () => dispatch({
    type: 'toggleMatrixStyle',
    payload: { }
  })

  const handleLeftRotateClick = () => dispatch({type: 'inpLR'})
  const handleRightRotateClick = () => dispatch({type: 'inpRR'})
  const handleNextTetClick = () => dispatch({type: 'inpNextTet'})
  const handleLeftClick = () => dispatch({type: 'inpL'})
  const handleRightClick = () => dispatch({type: 'inpR'})
  const handleUpClick = () => dispatch({type: 'inpU'})
  const handleDownClick = () => dispatch({type: 'inpD'})

  return (
    <>
      <View style={R.mergeLeft(styles.game, R.defaultTo({}, props.style))}>
        <Matrix style={styles.matrix} />
      </View>
      <View style={styles.buttonRow}>
        <Presser
          text="L"
          onPress={handleLeftRotateClick}
        />
        <Presser
          text="<"
          onPress={handleLeftClick}
        />
        <Presser
          text="v"
          onPress={handleDownClick}
        />
        <Presser
          text=">"
          onPress={handleRightClick}
        />
        <Presser
          text="R"
          onPress={handleRightRotateClick}
        />
      </View>
      <View style={styles.buttonRow}>
        <Presser
          text="test pattern"
          onPress={handleTestPatternClick}
        />
        <Presser
          text="new game"
          onPress={handleNewGameClick}
        />
        <Presser
          text="toggle style"
          onPress={handleToggleStyleClick}
        />
        <Presser
          text="reset"
          onPress={handleResetClick}
        />
      </View>
    </>
  )
}
