import React from 'react'

import {
  ImageBackground,
  StyleSheet,
  View
} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import makeRange from '../fun/makeRange'

import { carousel, idleBackground } from '../Images'

import Block from './components/Block'

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch'
  },
  background: {
    display: 'flex',
    flex: 1
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    height: '50%',
  }
})

const Matrix = props => {
  const tickMode = useSelector(R.path(['tick', 'mode']))
  const [ cols, rows ] = useSelector(R.path(['game', 'size']))
  const completedRows = useSelector(R.path(['game', 'completedRows']))
  const gameLevel = useSelector(R.path(['game', 'level']))

  const background =
    tickMode !== 'game'
      ? idleBackground
      : carousel[(gameLevel - 1) % R.length(carousel)]

  const getIsCompleted =
    R.isEmpty(completedRows)
      ? R.F :
      R.compose(
        R.not,
        R.isNil,
        R.flip(R.find)(completedRows),
        R.equals
      )

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <ImageBackground source={background} style={styles.background}>
        {
          R.map(
            row => (
              <View key={row} style={styles.row}>
                {
                  R.map(
                    col => (
                      <Block
                        key={row * cols + col}
                        i={col}
                        j={row}
                        isCompleted={getIsCompleted(row)}
                      />
                    ),
                    makeRange(cols)
                  )
                }
              </View>
            ),
            R.reverse(makeRange(rows))
          )
        }
      </ImageBackground>
    </View>
  )
}

export default Matrix
