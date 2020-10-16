import React from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View
} from 'react-native';

import * as R from 'ramda'

import { actions } from '../state/actions'
import thunks from '../state/thunks'
import * as Theme from '../theme'

import Presser from './components/Presser'

const padding = 5

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
    paddingTop: padding,
    paddingRight: padding,
    paddingLeft: padding,
    paddingBottom: 0,
    borderRadius: 4,
    backgroundColor: Theme.lightCharcoal,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    flexGrow: 0.25,
    flexShrink: 1,
    flexBasis: 'auto'
  },
  rightColumn: {
    marginLeft: padding
  },
  littleButton: {
    borderColor: Theme.darkOlive,
    marginBottom: padding
  },
  littleButtonPressed: {
    backgroundColor: Theme.darkPlum
  },
  littleButtonUnpressed: {
    backgroundColor: Theme.lightOlive
  },
  littleButtonTextPressed: {
    color: Theme.forestGreen
  },
  littleButtonTextUnpressed: {
    color: Theme.darkOlive
  }
})

const LittleButton = props => (
  <Presser
    size="small"
    style={styles.littleButton}
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
