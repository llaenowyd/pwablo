import React, { useState, useCallback, useMemo, useRef } from 'react'

import { createUseStyles, useTheme } from 'react-jss'

import * as R from 'ramda'

import dbg from '../../dbg'
import { View } from '../../react-native-dummies'
import Icon from '../Icon'

const basicJss = {
  view: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderColor: R.path(['theme', 'controls', 'button', 'borderColor']),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    cursor: 'pointer',
    userSelect: 'none',
  },
  viewPressed: {
    backgroundColor: R.path(['theme', 'controls', 'buttonActive', 'background']),
  },
  viewUnpressed: {
    backgroundColor: R.path(['theme', 'controls', 'button', 'background']),
  },
  icon: {
    fontSize: 55,
  },
  iconPressed: {
    color: R.path(['theme', 'controls', 'buttonActive', 'foreground']),
  },
  iconUnpressed: {
    color: R.path(['theme', 'controls', 'button', 'foreground']),
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
  const theme = useTheme()
  const styles = useStyles({theme})

  const iconColor = useMemo(
    R.thunkify(R.path(
      ['controls', isPressed ? 'buttonActive' : 'button', 'foreground']
    ))(theme), [theme])

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
