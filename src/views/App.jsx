import React from 'react'
import { useSelector } from 'react-redux'
import { createUseStyles, useTheme } from 'react-jss'
import * as R from 'ramda'

import { Text, View } from '../react-native-dummies'

import Game from './Game'

const useStyles = createUseStyles({
  app: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: R.path(['theme', 'background']),
    alignItems: 'center',
    justifyContent: 'center',
  },
  debug: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontFamily: 'VT323-Regular',
    color: R.path(['theme', 'debugColor']),
  },
})

const Debug = () => {
  const tickIdle = useSelector(R.path(['tick', 'idle']))
  const tickMode = useSelector(R.path(['tick', 'mode']))
  const skewDiagnostic = useSelector(R.path(['tick', 'skewDiagnostic']))
  const gameClock = useSelector(R.path(['game', 'clock']))

  const theme = useTheme()
  const styles = useStyles({ theme })

  const diagnostic = ((sd, cd) => `${sd}${cd}`)(
    R.defaultTo('', skewDiagnostic),
    tickIdle || tickMode !== 'game' ? '' : ` ${gameClock}`,
  )

  return <Text className={styles.debug}>{diagnostic}</Text>
}

const App = () => {
  const theme = useTheme()
  const styles = useStyles({ theme })

  return (
    <View className={styles.app}>
      <Game />
      <Debug />
    </View>
  )
}

export default App
