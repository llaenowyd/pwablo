import React from 'react'

import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import * as R from 'ramda'

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 16
  },
  pressable: {
    borderRadius: 8,
    padding: 6
  },
  pressed: {
    backgroundColor: '#5d797a',
    color: '#ffd0be'
  },
  unpressed: {
    backgroundColor: '#c0fbff',
    color: '#635049'
  },
  textPressed: {

  },
  textUnpressed: {

  }
})

export default props => {
  const style =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.pressable
    )

  const getPupStyle =
    pressed =>
      R.mergeLeft(
        R.defaultTo(
          {},
          pressed ? props.stylePressed : props.styleUnpressed
        ),
        pressed ? styles.pressed : styles.unpressed
      )

  const textStyle =
    R.mergeLeft(
      R.defaultTo({}, props.textStyle),
      styles.text
    )

  const getPupTextStyle =
    pressed =>
      R.mergeLeft(
        R.defaultTo(
          {},
          pressed ? props.textStylePressed : props.textStyleUnpressed
        ),
        pressed ? styles.textPressed : styles.textUnpressed
      )

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [style, getPupStyle(pressed)]}
    >
      {
        ({pressed}) => (
          <Text style={[textStyle, getPupTextStyle(pressed)]}>{props.text}</Text>
        )
      }
    </Pressable>
  )
}
