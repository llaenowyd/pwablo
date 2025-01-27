import React from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles, useTheme } from 'react-jss'

import * as R from 'ramda'

import { Text } from '../react-native-dummies';


const useStyles = createUseStyles({
  text: {
    flex: 5,
    color: R.path(['theme', 'scoreAndNextTet', 'foreground']),
    fontFamily: 'Early GameBoy',
    fontWeight: '900',
    fontSize: 12,
    userSelect: 'none',
  },
})

const leftPad =
  (padc, len) =>
    R.chain(
      R.concat,
      R.compose(
        R.join(''),
        R.repeat(padc),
        R.subtract(len),
        R.length
      )
    )

export default props => {
  let score = useSelector(R.path(['game', 'score']))
  let level = useSelector(R.path(['game', 'level']))

  const theme = useTheme()
  const styles = useStyles({theme})

  return (
    <Text
      allowFontScaling={false}
      adjustsFontSizeToFit={true}
      numberOfLines={1}
      className={styles.text}
    >
      {
        R.isNil(score)
          ? 'pwablo'
          : R.concat(
              leftPad(' ', 10)(String(score)),
              ` Lv.${level}`
        )
      }
    </Text>
  )
}
