import React, { useState, useRef, useCallback } from 'react'

import { createUseStyles, useTheme } from 'react-jss'

import * as R from 'ramda'

import { Text } from '../../react-native-dummies'

const basicJss = {
  view: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: R.path(['theme', 'menu', 'button', 'borderColor']),
    borderRadius: 5,
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 5,
    paddingLeft: 4,
    cursor: 'pointer',
    userSelect: 'none',
  },
  viewPressed: {
    backgroundColor: R.path(['theme', 'menu', 'buttonActive', 'background']),
    color: R.path(['theme', 'menu', 'buttonActive', 'foreground']),
  },
  viewUnpressed: {
    backgroundColor: R.path(['theme', 'menu', 'button', 'background']),
    color: R.path(['theme', 'menu', 'button', 'foreground']),
  },
}

const useStyles = createUseStyles({
  text: {
    fontFamily: 'Early GameBoy',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 9,
  },
  viewPressed: R.mergeRight(basicJss.view, basicJss.viewPressed),
  viewUnpressed: R.mergeRight(basicJss.view, basicJss.viewUnpressed),
})

export default props => {
  const [isPressed, setIsPressed] = useState(false)
  const refIsPressed = useRef(isPressed)

  const theme = useTheme()
  const styles = useStyles({theme})

  const onClick = useCallback(R.compose(
      R.when(
        R.compose(
          R.not,
          R.prop('current'),
          R.head
        ),
        R.compose(
          R.apply(R.compose),
          R.map(
            R.chain(
              R.curryN(2, R.compose)(
                R.__,
                R.tail
              ),
              R.compose(
                R.apply,
                R.head
              )
            )
          ),
          R.flip(R.zip)([
            false,
            undefined,
            false,
          ]),
          R.map(R.thunkify),
          R.juxt([
            R.nth(1),
            R.nth(2),
            R.nth(1),
          ])
        )
      )
    )([refIsPressed, setIsPressed, props.onPress]),
      [refIsPressed, setIsPressed, props.onPress])

  return (
    <div className={isPressed ? styles.viewPressed : styles.viewUnpressed} onClick={onClick}>
      <Text
        allowFontScaling={false}
        adjustsFontSizeToFit={true}
        className={styles.text}
      >
        {props.text}
      </Text>
    </div>
  )
}
