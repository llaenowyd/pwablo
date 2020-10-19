import * as R from 'ramda'

import makeRange from '../../fun/makeRange'
import {kickers} from '../../tets'
import {isOpen} from '../../bucket'

import {drawTet, eraseTet} from './draw'

const incRotos =
  [
    // ccw
    R.ifElse(
      R.equals(3),
      R.always(0),
      R.add(1)
    ),
    // cw
    R.ifElse(
      R.equals(0),
      R.always(3),
      R.add(-1)
    )
  ]

//  2 │ 1
// ───┼───
//  3 │ 4

const invertNum = x => x === 0 ? x : -1 * x

const f1cw = ([i,j]) => [j, -1*i]
const f1ccw = ([i,j]) => [-1*j, i]
const flipXY = ([i,j]) => [invertNum(j), invertNum(i)]
const reflect = ([i,j]) => [j,i]

// (true|false) -> originTet -> result
const rot1 =
  cw =>
    ((incrot, pointOps) =>
      R.compose(
        R.over(
          R.lensProp('points'),
          points => R.map(R.cond(pointOps))(points)
        ),
        R.over(
          R.lensProp('rot'),
          incrot
        )
      )
    )(
      incRotos[cw?1:0],
      [
        [
          ([i,j]) => i === 0 && j !== 0,
          cw ? reflect : flipXY
        ],
        [
          ([i,j]) => i !== 0 && j === 0,
          cw ? flipXY : reflect
        ],
        [
          ([i,j]) => i === 0 && j === 0,
          R.identity
        ],
        [
          R.T,
          cw ? f1cw : f1ccw
        ]
      ]
    )

// (true|false) -> tet -> maybeRotatedTet
const rot1AndTest = (bucket, cw, tet) => {
  const rotatedTet = rot1(cw)(tet)

  if (isOpen(bucket, tet)(rotatedTet)) return rotatedTet

  const kicks = kickers[tet.kind][cw?1:0][tet.rot]

  const applyKick =
    tet => kick => R.over(R.lensProp('pos'), kick, tet)

  return R.compose(
    R.unless(
      R.isNil,
      applyKick(rotatedTet)
    ),
    R.find(
      R.compose(
        isOpen(bucket, tet),
        applyKick(rotatedTet)
      )
    )
  )(kicks) ?? tet
}

const rotNAndTest = (bucket, n, tet) => {
  const cw = n>0

  return R.reduce(
    tet => {
      const tet2 = rot1AndTest(bucket, cw, tet)

      return tet.rot === tet2.rot ? R.reduced(tet) : tet2
    },
    tet,
    makeRange(Math.abs(n%4))
  )
}

const rotate =
  n =>
    R.chain(
      ([bucket, actiTet]) =>
        R.chain(
          maybeRotatedTet =>
            maybeRotatedTet.rot === actiTet.rot
              ? R.identity
              : R.compose(
                  state => drawTet(state)(maybeRotatedTet),
                  R.set(R.lensPath(['game', 'actiTet']), maybeRotatedTet),
                  state => eraseTet(state)(actiTet)
                ),
          () => rotNAndTest(bucket, n, actiTet)
        ),
      R.juxt([
        R.path(['game', 'bucket']),
        R.path(['game', 'actiTet'])
      ])
    )

export const leftRot = rotate(-1)

export const riteRot = rotate(1)
