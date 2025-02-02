import React from 'react'
import * as R from 'ramda'

import constants from '../../constants'
import { Text, View } from '../../react-native-dummies'

export default ({className, bloKind, matrixStyle}) =>
  R.ifElse(
    R.equals(constants.matrixStyle.annotated),
    R.always(
      <Text allowFontScaling={false} className={className}>
        {bloKind}
      </Text>
    ),
    R.always(<View className={className} />)
  )(matrixStyle)
