
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
    backgroundColor: 'lightblue'
  }
})

const Debug = () => {
  // const [x, setX] = useState(0)
  //
  // useEffect(() => {
  //     rand1().then(
  //       setX
  //     )
  //   },
  //   []
  // )
  const diagnostic = useSelector(R.prop('diagnostic'))

  return (
    <Text style={styles.debug}>{diagnostic ?? ''}</Text>
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
