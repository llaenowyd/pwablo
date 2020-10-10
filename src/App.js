
import React, {useEffect, useState} from 'react'

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import { Provider } from './state'

import Game from './views/Game'
import { rand1 } from './Random'

const styles = StyleSheet.create({
  body: {
    height: '100%'
  },
  debug: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    fontFamily: 'VT323-Regular'
  },
  game: {
    height: '80%',
    margin: 10,
    backgroundColor: 'aliceblue'
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
      <StatusBar backgroundColor="#005670" barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <Game style={styles.game} />
          <Debug />
        </View>
      </SafeAreaView>
    </Provider>
  )

export default App;
