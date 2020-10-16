import React from 'react'

import Icon from 'react-native-vector-icons/Feather'

import * as R from 'ramda'

const makeIcon =
  iconName => ({size, color}) => (<Icon name={iconName} size={size} color={color} />)

export default R.compose(
    R.fromPairs,
    R.map(
      R.over(
        R.lensIndex(1),
        makeIcon
      )
    )
  )([
    ['rotr', 'rotate-cw'],
    ['rotl', 'rotate-ccw'],
    ['down', 'arrow-down'],
    ['left', 'arrow-left'],
    ['right', 'arrow-right'],
    ['note', 'music'],
    ['tone', 'volume-1']
  ])
