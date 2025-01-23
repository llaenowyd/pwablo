import React from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { Text, View } from './react-native-dummies'
import { SoundController } from './Sounds'
import { Provider } from './state'
import themes from './themes'
import Game from './views/Game'

const themeName = 'arcade'
const {debugColor} = themes[themeName]

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  debug: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontFamily: 'VT323-Regular',
    color: debugColor,
  },
})

const Debug = () => {
  const tickIdle = useSelector(R.path(['tick', 'idle']))
  const tickMode = useSelector(R.path(['tick', 'mode']))
  const skewDiagnostic = useSelector(R.path(['tick', 'skewDiagnostic']))
  const gameClock = useSelector(R.path(['game', 'clock']))

  styles = useStyles()

  const diagnostic = ((sd, cd) => `${sd}${cd}`)(
    R.defaultTo('', skewDiagnostic),
    tickIdle || tickMode !== 'game' ? '' : ` ${gameClock}`,
  )

  return <Text className={styles.debug}>{diagnostic}</Text>
}

const App = () => {
  const styles = useStyles()

  return (
    <Provider>
      <SoundController />
      <View className={styles.container}>
        <Game />
      </View>
    </Provider>
  )
}

export default App
