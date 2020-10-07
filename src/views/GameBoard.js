import React from 'react'

import {
  StyleSheet,
  View
} from 'react-native'

import * as R from 'ramda'

const styles = StyleSheet.create({
  gameBoard: {
    position: 'relative'
  },
})

export default props => {

  return (
    <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.gameBoard)}>
    </View>
  )
}
