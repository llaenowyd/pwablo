import React from 'react'

import {Animated, StyleSheet, Text, View} from 'react-native';

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import themes from '../themes'

const themeName = 'arcade'
const {scoreAndNextTet: scoreAndNextTetTheme} = themes[themeName]

const styles = StyleSheet.create({
  text: {
    flex: 1,
    color: scoreAndNextTetTheme.foreground,
    fontFamily: 'Early GameBoy',
    fontWeight: '900',
    fontSize: 12
  }
})

export default props => {
  const score = useSelector(R.path(['game', 'score']))

  if (R.isNil(score)) {
    return (<View />)
  }

  return (
    <Text
      allowFontScaling={false}
      adjustsFontSizeToFit={true}
      numberOfLines={1}
      style={R.mergeLeft(R.defaultTo({}, props.style), styles.text)}
    >
      {`SCORE: ${score}`}
    </Text>
  )
}
