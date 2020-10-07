import React from 'react'

import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import * as Tets from '../tets'

const styles = StyleSheet.create({
  nextPiece: {
    position: 'relative',
    backgroundColor: 'lightblue'
  },
  littleGrid: {
    height: 100,
    width: 100,
    backgroundColor: 'grey',
    borderWidth: 1,
    borderColor: 'blue',
    display: 'flex'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    height: '25%'
  },
  cell: {
    width: '25%',
    backgroundColor: 'darkgrey',
    borderWidth: 0.5,
    borderColor: 'black'
  }
})

export default props => {
  const nextPieceKind = useSelector(R.path(['game', 'nextPiece']))

  const nextPiece = Tets.create(nextPieceKind)([0,0])
  const nextPieceColor = nextPiece.color

  const indexes = [0,1,2,3]

  return (
    <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.nextPiece)}>
      <Text>{`Next piece: ${nextPieceKind}`}</Text>
      <Text>{JSON.stringify(nextPiece.blocks)}</Text>
      <View style={styles.littleGrid}>
        {
          R.map(
            i => (
              <View key={i} style={styles.row}>
                {
                  R.map(
                    j => (
                      <View style={
                        R.mergeLeft(
                          R.includes([j,3-i], nextPiece.blocks)
                            ? {backgroundColor: nextPieceColor}
                            : {},
                          styles.cell
                        )} key={`${i},${j}`}
                      >

                      </View>
                    ),
                    indexes
                  )
                }
              </View>
            ),
            indexes
          )
        }
      </View>
    </View>
  )
}
