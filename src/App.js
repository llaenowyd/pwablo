
import React from 'react'

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import { Provider } from './state'
import themes from './themes'

import Game from './views/Game'

const themeName = 'arcade'
const {debugColor} = themes[themeName]

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  game: {
    flex: 1
  },
  debug: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontFamily: 'VT323-Regular',
    color: debugColor
  }
})

const Debug = () => {
  const tickIdle = useSelector(R.path(['tick', 'idle']))
  const tickMode = useSelector(R.path(['tick', 'mode']))
  const skewDiagnostic = useSelector(R.path(['tick', 'skewDiagnostic']))
  const gameClock = useSelector(R.path(['game', 'clock']))

  const diagnostic =
    ((sd, cd) => `${sd}${cd}`
    )(
      R.defaultTo('', skewDiagnostic),
      tickIdle || tickMode !== 'game' ? '' : ` ${gameClock}`
    )

  return (
    <Text style={styles.debug}>{diagnostic}</Text>
  )
}

const App = () => (
    <Provider>
      <SafeAreaView style={{height: '100%'}}>
        <View style={styles.container}>
          <Game style={styles.game}/>
          <Debug />
        </View>
      </SafeAreaView>
    </Provider>
  )

export default App;
