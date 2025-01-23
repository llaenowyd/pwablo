import React, { useState, useCallback, useRef } from 'react'

import { createUseStyles } from 'react-jss'

import * as R from 'ramda'

import { View } from '../../react-native-dummies'
import themes from '../../themes'
import Icon from './Icon'

const themeName = 'arcade'
const {controls:controlsTheme} = themes[themeName]

const basicJss = {
  view: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderColor: controlsTheme.button.borderColor,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    cursor: 'pointer',
  },
  viewPressed: {
    backgroundColor: controlsTheme.buttonActive.background,
  },
  viewUnpressed: {
    backgroundColor: controlsTheme.button.background,
  },
  icon: {
    fontSize: 55,
  },
  iconPressed: {
    color: controlsTheme.buttonActive.foreground,
  },
  iconUnpressed: {
    color: controlsTheme.button.foreground,
  },
}

const useStyles = createUseStyles({
  viewPressed: R.mergeRight(basicJss.view, basicJss.viewPressed),
  viewUnpressed: R.mergeRight(basicJss.view, basicJss.viewUnpressed),
  crossView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPressed: R.mergeRight(basicJss.icon, basicJss.iconPressed),
  iconUnpressed: R.mergeRight(basicJss.icon, basicJss.iconUnpressed),
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

  const iconColor = isPressed ? basicJss.iconPressed.color : basicJss.iconUnpressed.color

  return (
    <div className={isPressed ? styles.viewPressed : styles.viewUnpressed} onClick={onClick}>
      <View className={styles.crossView}>
        <div style={{flex: 1, color: iconColor}}>
        <Icon name={props.icon} color={iconColor} size={30} />
        </div>
      </View>
    </div>
  )
}
