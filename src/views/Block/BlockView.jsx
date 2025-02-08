import React from 'react'
import * as R from 'ramda'

import constants from '~/constants'

import Text from '../Text'
import View from '../View'

export default ({className, bloKind, matrixStyle}) =>
  R.ifElse(
    R.equals(constants.matrixStyle.annotated),
    R.always(
      <Text className={className}>
        {bloKind}
      </Text>
    ),
    R.always(<View className={className} />)
  )(matrixStyle)
