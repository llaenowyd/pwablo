import React from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View
} from 'react-native';

import * as R from 'ramda'

import thunks from '../state/thunks'
import Presser from './components/Presser'

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto',
    paddingTop: 5,
    paddingRight: 5,
    paddingLeft: 5,
    paddingBottom: 0,
    borderRadius: 4,
    backgroundColor: '#202020',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },
  rightColumn: {
    marginLeft: 10
  },
  stackedButton: {
    marginBottom: 5
  },
  littleButtonPressed: {
    backgroundColor: '#404055'
  },
  littleButtonUnpressed: {
    backgroundColor: '#202010'
  },
  littleButtonTextPressed: {
    color: '#216317'
  },
  littleButtonTextUnpressed: {
    color: '#216317'
  }
})

const LittleButton = props => (
  <Presser
    size="small"
    style={styles.stackedButton}
    stylePressed={styles.littleButtonPressed}
    styleUnpressed={styles.littleButtonUnpressed}
    textStylePressed={styles.littleButtonTextPressed}
    textStyleUnpressed={styles.littleButtonTextUnpressed}
    text={props.text}
    onPress={props.onPress}
  />
)

const LittleButtonCluster = props => {
  const dispatch = useDispatch()

  const handleTestPatternClick = () => dispatch(thunks.testPattern())
  const handleNewGameClick = () => dispatch(thunks.newGame())
  const handleResetClick = () => dispatch(thunks.reset())

  const handleToggleStyleClick = () => dispatch({
    type: 'toggleMatrixStyle',
    payload: { }
  })

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <View style={styles.column}>
        <LittleButton
          text="grid"
          onPress={handleToggleStyleClick}
        />
        <LittleButton
          text="reset"
          onPress={handleResetClick}
        />
      </View>
      <View style={[styles.column, styles.rightColumn]}>
        <LittleButton
          text="pattern"
          onPress={handleTestPatternClick}
        />
        <LittleButton
          text="new game"
          onPress={handleNewGameClick}
        />
      </View>
    </View>
  )
}

export default LittleButtonCluster
