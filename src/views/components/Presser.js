import React from 'react'

import {Animated, Pressable, StyleSheet, Text} from 'react-native';

import * as R from 'ramda'

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    borderColor: 'black',
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
    fontSize: 9
  },
  textLarge: {
    fontSize: 20
  },
  textSmall: {
    fontSize: 9
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

  const getInnerStyle =
    (([
      innerStyle,
      innerLargeStyle,
      innerSmallStyle,
      innerPressedStyle,
      innerUnpressedStyle,
      innerStyleProp,
      stylePropPressed,
      stylePropUnpressed
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
                pressed ? stylePropPressed : stylePropUnpressed
              )
            )
          )
        )
    )([
      styles.text,
      styles.textLarge,
      styles.textSmall,
      styles.textPressed,
      styles.textUnpressed,
      props.textStyle,
      props.stylePressed,
      props.styleUnpressed
    ])


  return (
    <Pressable style={({pressed}) => getViewStyle(pressed)} onPress={props.onPress}>
        {
          ({pressed}) => {
            const innerStyle = getInnerStyle(pressed)

            return (
              <Text
                allowFontScaling={false}
                adjustsFontSizeToFit={true}
                style={innerStyle}
              >
                {props.text}
              </Text>
            )
          }
        }
    </Pressable>
  )
}
