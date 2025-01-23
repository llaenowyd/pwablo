import * as R from 'ramda'

import {Alert} from '../react-native-dummies'

const catcher = tag => e => {
  console.error(tag, e)
}

export const tryCatcher = tag => f => R.tryCatch(f, catcher(tag))

export const alertOnce =
  R.once(
    msg => {
      Alert.alert('error', msg)
    }
  )

const alertCatcher = tag => e => {
  console.error(tag, e)
  alertOnce(`${tag}: ${e.message}`)
}

export const tryAlertOnce = tag => f => R.tryCatch(f, alertCatcher(tag))
