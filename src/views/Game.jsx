import React, { useEffect, useMemo } from 'react'

import { useDispatch } from 'react-redux'

import { createUseStyles, useTheme } from 'react-jss'

import * as R from 'ramda'

import constants from '../constants'
import dbg from '../dbg'
import { useDisplay } from '../display'
import { View } from '../react-native-dummies';
import { actions } from '../state/actions'

import Controls from './Controls'
import KeyboardControls from './KeyboardControls'
import Matrix from './Matrix'
import ScoreAndNext from './ScoreAndNext'

const useStyles = createUseStyles({
  game: {
    aspectRatio: constants.aspectRatio.game,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100%',
    maxHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: R.path(['theme', 'background']),
  },
  verticalBound: {
    height: '100%',
  },
  horizontalBound: {
    width: '100%',
  },
  scoreAndNext: {
  },
})

export default () => {
  const dispatch = useDispatch()

  const theme = useTheme()
  const styles = useStyles({theme})
  const display = dbg.T('display')(
    useDisplay()
  )

  const className = useMemo(
    () => R.compose(
      R.when(
        R.isNotNil,
        R.join(' ')
      ),
      R.cond([
        [
          R.isNil,
          R.always(null),
        ],
        [
          R.lt(constants.aspectRatio.game),
          R.always([styles.game, styles.verticalBound]),
        ],
        [
          R.gt(constants.aspectRatio.game),
          R.always([styles.game, styles.horizontalBound]),
        ],
        [
          R.T,
          R.always([styles.game, styles.horizontalBound, styles.verticalBound])
        ]
      ])
    )(display.ratio), [display, styles])

  useEffect(() => {
    return () => dispatch({type: actions.stopTick})
  }, [dispatch])

  return null == display.ratio ? (
      <div>spinner</div>
    ) : (
      <View className={className}>
        <ScoreAndNext />
        <Matrix />
        <Controls />
        <KeyboardControls />
      </View>
    ) 
}
