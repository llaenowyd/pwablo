import React from 'react'

import { ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import * as R from 'ramda'

import {
  down,
  info,
  left,
  note,
  rite,
  rotl,
  rotr, savior,
  tone,
} from '../../Images';

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderColor: 'darkgreen',
    borderRadius: 5,
    padding: 4
  },
  viewLarge: {
  },
  viewSmall: {
  },
  text: {
    fontFamily: 'Early GameBoy',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 16
  },
  textLarge: {
    fontSize: 20,
  },
  textSmall: {
    fontSize: 10,
  },
  imageBg: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 15,
    height: 15
  },
  iconLarge: {
    width: 50,
    height: 50
  },
  iconSmall: {

  },
  pressed: {
  },
  unpressed: {
  },
  textPressed: {
  },
  textUnpressed: {
  }
})

export default props => {
  // const [propsStylePruned, propsStyleHeight] = takeomit(['height'])(props)

  const getViewStyle =
    pressed =>
      R.mergeLeft(
        R.defaultTo({}, props.style),
        R.mergeRight(
          styles.view,
          R.mergeRight(
            props.size === 'small'
              ? styles.viewSmall
              : props.size === 'large'
              ? styles.viewLarge
              : {},
              R.mergeRight(
                R.defaultTo(
                  {},
                  pressed ? props.stylePressed : props.styleUnpressed
                ),
                pressed ? styles.pressed : styles.unpressed
              )
          )
        )
      )

  const iconImage =
    R.flip(R.prop)({
      down,
      info,
      left,
      note,
      rite,
      rotl,
      rotr,
      tone
    })(props.icon)

  const getInnerStyle =
    (([
      innerStyle,
      innerLargeStyle,
      innerSmallStyle,
      innerPressedStyle,
      innerUnpressedStyle,
      innerStyleProp,
      innerPressedStyleProp,
      innerUnpressedStyleProp
    ]) =>
      pressed =>
        R.mergeRight(
          R.defaultTo({}, innerStyleProp),
          R.mergeRight(
            R.mergeRight(
              innerStyle,
              props.size === 'small'
                ? innerSmallStyle
                : props.size === 'large'
                ? innerLargeStyle
                : {}
            ),
            R.mergeRight(
              pressed ? innerPressedStyle : innerUnpressedStyle,
              R.defaultTo(
                {},
                pressed ? innerPressedStyleProp : innerUnpressedStyleProp
              )
            )
          )
        )
    )(
      R.isNil(iconImage)
        ? [
          styles.text,
          styles.textLarge,
          styles.textSmall,
          styles.textPressed,
          styles.textUnpressed,
          props.textStyle,
          props.textStylePressed,
          props.textStyleUnpressed
        ] : [
          styles.icon,
          styles.iconLarge,
          styles.iconSmall,
          styles.iconPressed,
          styles.iconUnpressed,
          props.iconStyle,
          props.iconStylePressed,
          props.iconStyleUnpressed
        ]
    )


  return (
    <Pressable style={({pressed}) => getViewStyle(pressed)} onPress={props.onPress}>
        {
          ({pressed}) =>
            iconImage
              ? (
                <ImageBackground source={iconImage} style={styles.imageBg}>
                  <View style={getInnerStyle(pressed)} />
                </ImageBackground>
              ) : (
                <Text style={getInnerStyle(pressed)}>{props.text}</Text>
              )
        }
    </Pressable>
  )
}
