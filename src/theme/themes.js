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

export default {
  oliveCharcoal: {
    background: darkCharcoal,
    debugColor: lightCharcoal,
    controls: {
      background: darkCharcoal,
      button: {
        background: lightOlive,
        borderColor: darkOlive,
        color: darkOlive,
      },
      buttonActive: {
        background: plum,
      },
    },
    menu: {
      background: lightCharcoal,
      borderColor: black,
      button: {
        background: lightOlive,
        foreground: darkOlive,
        borderColor: darkOlive,
      },
      buttonActive: {
        background: darkPlum,
        foreground: forestGreen,
      },
    },
    scoreAndNextBlo: {
      background: darkCharcoal,
      foreground: lightOlive,
    },
  },
  arcade: {
    background: blackViolet,
    debugColor: violet,
    controls: {
      background: blackViolet,
      button: {
        background: darkViolet,
        borderColor: violet,
        foreground: lightPistachio,
      },
      buttonActive: {
        background: violet,
        foreground: darkViolet,
      },
    },
    menu: {
      background: midnight,
      borderColor: darkViolet,
      button: {
        background: darkViolet,
        foreground: lightPistachio,
        borderColor: violet,
      },
      buttonActive: {
        background: lightPistachio,
        foreground: darkViolet,
      },
    },
    scoreAndNextBlo: {
      background: darkViolet,
      foreground: lightPistachio,
    },
  },
}
