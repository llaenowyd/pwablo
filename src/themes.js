import * as R from 'ramda'

import Color from 'color'

const black = 'black'

const blackViolet = '#08001b'
const darkViolet = '#0c0029'
const violet = '#3500ba'
const darkPistachio = '#212108'
const lightPistachio = '#dfe07f'

const darkCharcoal = '#101010'
const lightCharcoal = '#202020'

const darkOlive = '#1E261D'
const lightOlive = '#5C7B57'

const blackPlum = '#210029'
const darkPlum = '#404055'
const plum = '#646476'

const midnight = '#000929'
const forestGreen = '#216317'

const blockPrimaries = {
  I: 'aqua',
  J: 'blue',
  L: 'orange',
  O: 'yellow',
  S: 'green',
  T: 'darkorchid',
  Z: 'red'
}

const blockDefaults = {
  complementDarken: 0.35
}

const blockTunings = {
  J: {
    complementDarken: -0.55
  },
  T: {
    complementDarken: -0.75
  },
  Z: {
    complementDarken: -0.75
  }
}

const getTunings =
  R.compose(
    R.mergeRight(blockDefaults),
    R.defaultTo({}),
    R.flip(R.prop)(blockTunings)
  )

const blocks =
  R.compose(
    R.fromPairs,
    R.map(
      R.chain(
        ({complementDarken}) =>
            R.over(
              R.lensIndex(1),
              primary => ({
                primary: Color(primary).fade(0.5).hex(),
                shadow: Color(primary).darken(0.35).fade(0.5).hex(),
                highlight: Color(primary).lighten(0.35).fade(0.5).hex(),
                complement: Color(primary).rotate(180).darken(complementDarken).hex()
              })
            ),
        ([tetKind]) => getTunings(tetKind)
      )
    ),
    R.toPairs
  )(blockPrimaries)

const emptyBlock = {
  complement: darkCharcoal
}

export default {
  oliveCharcoal: {
    background: darkCharcoal,
    debugColor: lightCharcoal,
    controls: {
      background: darkCharcoal,
      button: {
        background: lightOlive,
        borderColor: darkOlive,
        color: darkOlive
      },
      buttonActive: {
        background: plum
      }
    },
    menu: {
      background: lightCharcoal,
      borderColor: black,
      button: {
        background: lightOlive,
        foreground: darkOlive,
        borderColor: darkOlive
      },
      buttonActive: {
        background: darkPlum,
        foreground: forestGreen
      }
    },
    scoreAndNextTet: {
      background: darkCharcoal,
      foreground: lightOlive
    },
    blocks,
    emptyBlock
  },
  arcade: {
    background: blackViolet,
    debugColor: violet,
    controls: {
      background: blackViolet,
      button: {
        background: darkViolet,
        borderColor: violet,
        foreground: lightPistachio
      },
      buttonActive: {
        background: violet,
        foreground: darkViolet
      }
    },
    menu: {
      background: midnight,
      borderColor: darkViolet,
      button: {
        background: darkViolet,
        foreground: lightPistachio,
        borderColor: violet
      },
      buttonActive: {
        background: lightPistachio,
        foreground: darkViolet
      }
    },
    scoreAndNextTet: {
      background: darkViolet,
      foreground: lightPistachio
    },
    blocks,
    emptyBlock
  }
}
