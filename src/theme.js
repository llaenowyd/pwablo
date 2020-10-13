import * as R from 'ramda'

import Color from 'color'

export const darkCharcoal = '#101010'
export const lightCharcoal = '#202020'

export const darkOlive = '#1E261D'
export const lightOlive = '#5C7B57'

export const darkPlum = '#404055'
export const plum = '#646476'

export const forestGreen = '#216317'

export const block =
    R.map(
      ({primary, complementDarken}) => ({
        primary: Color(primary).fade(0.5).hex(),
        shadow: Color(primary).darken(0.35).fade(0.5).hex(),
        highlight: Color(primary).lighten(0.35).fade(0.5).hex(),
        complement: Color(primary).rotate(180).darken(R.defaultTo(0.35, complementDarken)).hex()
      })
    )({
      I: {
        primary: '#00ffff'
      },
      J: {
        primary: '#0000ff',
        complementDarken: -0.55
      },
      L: {
        primary: '#ffa500'
      },
      O: {
        primary: '#ffff00'
      },
      S: {
        primary: '#00ff00'
      },
      T: {
        primary: '#9932cc',
        complementDarken: -0.75
      },
      Z: {
        primary: '#ff0000',
        complementDarken: -0.75
      }
    })
