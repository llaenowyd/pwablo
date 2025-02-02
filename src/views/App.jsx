import React from 'react'
import { createUseStyles, useTheme } from 'react-jss'
import * as R from 'ramda'

import { View } from '../react-native-dummies'

import FrameDiagnostic from './FrameDiagnostic'
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
})

const App = () => {
  const theme = useTheme()
  const styles = useStyles({ theme })

  return (
    <View className={styles.app}>
      <Game />
      <FrameDiagnostic />
    </View>
  )
}

export default App
