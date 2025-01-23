import React from 'react'

import { useSelector } from 'react-redux'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { Text } from '../react-native-dummies';
import themes from '../themes'

const themeName = 'arcade'
const {scoreAndNextTet: scoreAndNextTetTheme} = themes[themeName]

const useStyles = createUseStyles({
  text: {
    flex: 5,
    color: scoreAndNextTetTheme.foreground,
    fontFamily: 'Early GameBoy',
    fontWeight: '900',
    fontSize: 12,
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

  const styles = useStyles()

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
