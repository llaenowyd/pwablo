import React, { useState, useRef, useCallback } from 'react'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { Text } from '../../react-native-dummies'
import themes from '../../themes'

const themeName = 'arcade'
const {menu:menuTheme} = themes[themeName]

const basicJss = {
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 5,
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 5,
    paddingLeft: 4,
    borderColor: menuTheme.button.borderColor,
    cursor: 'pointer',
  },
  viewPressed: {
    backgroundColor: menuTheme.buttonActive.background,
    color: menuTheme.buttonActive.foreground,
  },
  viewUnpressed: {
    backgroundColor: menuTheme.button.background,
    color: menuTheme.button.foreground,
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
  const onClick = useCallback(() => {
    if (refIsPressed.current) {
      return
    }
    setIsPressed(true)
    props.onPress()
    setIsPressed(false)
  }, [refIsPressed, setIsPressed, props.onPress])
  const styles = useStyles()

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
