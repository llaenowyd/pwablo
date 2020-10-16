import React from 'react'

import {  Pressable, StyleSheet, Text, View } from 'react-native'

import * as R from 'ramda'

import Icons from './Icons'

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    padding: 4
  },
  viewPressed: {
  },
  viewUnpressed: {
  },
  crossView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  crossViewPressed: {
  },
  crossViewUnpressed: {
  },
  icon: {
  },
  iconPressed: {
  },
  iconUnpressed: {
  }
})

export default props => {
  const style1 = R.mergeLeft(styles.view, R.defaultTo({}, props.style))

  const getPressedStyle1 =
    isPressed =>
      isPressed
        ? R.mergeLeft(styles.viewPressed, R.defaultTo({}, props.stylePressed))
        : R.mergeLeft(styles.viewUnpressed, R.defaultTo({}, props.styleUnpressed))

  const getViewStyle =
    isPressed =>
      R.mergeRight(style1, getPressedStyle1(isPressed))

  const getCrossViewStyle =
    isPressed =>
      R.mergeRight(styles.crossView, isPressed ? styles.crossViewPressed : styles.crossViewUnpressed)

  const getIconStyle =
    isPressed =>
      R.mergeRight(
        R.mergeLeft(
          styles.icon,
          R.defaultTo({}, props.iconStyle)
        ),
        isPressed
          ? R.mergeLeft(styles.iconPressed, R.defaultTo({}, props.iconStylePressed))
          : R.mergeLeft(styles.iconUnpressed, R.defaultTo({}, props.iconStyleUnpressed))
      )

  const Icon = Icons[props.icon]

  return (
    <Pressable style={({pressed}) => getViewStyle(pressed)} onPress={props.onPress}>
      {
        (
        ({pressed}) => {
          const crossViewStyle = getCrossViewStyle(pressed)
          const iconStyle = getIconStyle(pressed)

          return (
              <View style={crossViewStyle}>
                <Icon color={iconStyle.color} size={30} />
              </View>
            )
        }
        )(false)
      }
    </Pressable>
  )
}
