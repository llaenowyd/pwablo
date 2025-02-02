import * as R from 'ramda'

import {kickers} from '../../blo'
import range from '../../range'
import {isOpen} from '../bucket'

import {drawBlo, eraseBlo} from './draw'

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

// (true|false) -> originBlo -> result
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

// (true|false) -> blo -> maybeRotatedBlo
const rot1AndTest = (bucket, cw, blo) => {
  const rotatedBlo = rot1(cw)(blo)

  if (isOpen(bucket, blo)(rotatedBlo)) return rotatedBlo

  const kicks = kickers[blo.kind][cw?1:0][blo.rot]

  const applyKick =
    blo => kick => R.over(R.lensProp('pos'), kick, blo)

  return R.compose(
    R.unless(
      R.isNil,
      applyKick(rotatedBlo)
    ),
    R.find(
      R.compose(
        isOpen(bucket, blo),
        applyKick(rotatedBlo)
      )
    )
  )(kicks) ?? blo
}

const rotNAndTest = (bucket, n, blo) => {
  const cw = n>0

  return R.reduce(
    blo => {
      const blo2 = rot1AndTest(bucket, cw, blo)

      return blo.rot === blo2.rot ? R.reduced(blo) : blo2
    },
    blo,
    range(Math.abs(n%4))
  )
}

const rotate =
  n =>
    R.chain(
      ([bucket, actiBlo]) =>
        R.chain(
          maybeRotatedBlo =>
            maybeRotatedBlo.rot === actiBlo.rot
              ? R.identity
              : R.compose(
                  state => drawBlo(state)(maybeRotatedBlo),
                  R.set(R.lensPath(['game', 'actiBlo']), maybeRotatedBlo),
                  state => eraseBlo(state)(actiBlo)
                ),
          () => rotNAndTest(bucket, n, actiBlo)
        ),
      R.juxt([
        R.path(['game', 'bucket']),
        R.path(['game', 'actiBlo'])
      ])
    )

export const leftRot = rotate(-1)

export const riteRot = rotate(1)
