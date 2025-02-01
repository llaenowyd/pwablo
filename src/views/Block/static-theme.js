import * as R from 'ramda'

import Color from 'color'

import { MT, bloset } from '../../blo'
import constants from '../../constants'

const basicJss = {
  common: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: '4px',
    borderRadius: '4px',
    aspectRatio: 1,
    maxWidth: `${Math.floor(10000 / constants.cols) / 100}%`,
  },
  mini: {
    borderWidth: 2,
    borderRadius: 2,
  },
  anno: {
    fontFamily: 'VT323-Regular',
    fontWeight: '900',
    textAlign: 'center',
    paddingTop: 3,
  },
}

const blockPrimaries = {
  I: 'aqua',
  J: 'blue',
  L: 'orange',
  O: 'yellow',
  S: 'green',
  T: 'darkorchid',
  Z: 'red',
}

const blockDefaults = {
  complementDarken: 0.35,
}

const blockTunings = {
  J: {
    complementDarken: -0.55,
  },
  T: {
    complementDarken: -0.75,
  },
  Z: {
    complementDarken: -0.75,
  },
}

const getTunings =
  R.compose(
    R.mergeRight(blockDefaults),
    R.defaultTo({}),
    R.flip(R.prop)(blockTunings)
  )

const tkColors = R.compose(
    R.fromPairs,
    R.append([MT, {
      borderColor: Color('black').alpha(0).hexa()
    }]),
    R.map(
      R.chain(
        ({complementDarken}) =>
            R.adjust(1,
              R.compose(
                R.applySpec({
                  backgroundColor: R.prop('primary'),
                  color: R.prop('complement'),
                  borderTopColor: R.prop('highlight'),
                  borderRightColor: R.prop('shadow'),
                  borderBottomColor: R.prop('shadow'),
                  borderLeftColor: R.prop('highlight')
                }),
                primary => ({
                  primary: Color(primary).fade(0.5).hex(),
                  shadow: Color(primary).darken(0.35).fade(0.5).hex(),
                  highlight: Color(primary).lighten(0.35).fade(0.5).hex(),
                  complement: Color(primary).rotate(180).darken(complementDarken).hex()
                })
              )
            ),
        ([tetKind]) => getTunings(tetKind)
      )
    ),
    R.toPairs
  )(blockPrimaries)

const makeStyles = (maybePrefix, extendedStyles) => R.compose(
  R.fromPairs,
  R.map(
    R.compose(
      maybePrefix ? R.adjust(0, R.concat(maybePrefix)) : R.identity,
      R.adjust(1,
        R.compose(
          R.mergeRight(basicJss.common),
          extendedStyles ? R.mergeRight(extendedStyles) : R.identity,
          R.flip(R.prop)(tkColors)
        )
      ),
      R.flip(R.repeat)(2)
    )
  )
)([MT, ...bloset])

export default {
  ...makeStyles(),
  ...makeStyles('mini', basicJss.mini),
  ...makeStyles('anno', basicJss.anno),
}
