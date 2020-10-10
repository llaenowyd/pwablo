import * as R from 'ramda'

import { kicks } from '../tets'

export const drawActiTet = state => {
  const {game:{bucket, actiTet: {kind, points, pos}}} = state

  const [x, y] = pos

  R.forEach(
    ([i,j]) => {
      bucket[x + i][y + j] = kind
    },
    points
  )

  return state
}

const pokeBucket =
  bucket =>
    (cols =>
      (i, j, k) =>
        { if (i>=0 && j>=0 && i < cols) bucket[i][j] = k }
    )(bucket.length)

const drawPoints = ({kind, points, pos}) =>
  R.over(
    R.lensPath(['game', 'bucket']),
    bucket =>
      (pokeBlock => {
        R.forEach(
          ([i,j]) =>
            (
              ([it, jt]) => { pokeBlock(it, jt, kind) }
            )(
              [pos[0]+i, pos[1]+j]
            ),
          points
        )
        return bucket
      })(pokeBucket(bucket))
  )

const clearPoints = ({points, pos}) => drawPoints({kind: 0, points, pos})

const quadrots =
  [
    ([i,j]) => [i, -1*j],
    ([i,j]) => [-1*i, j],
    ([i,j]) => [j, i],
    ([i,j]) => [-1*j, -1*i]
  ]

const isFloored = R.any(([_,y]) => y < 0)

const isOpen =
  (cols, bucket) =>
    posOrigPoints =>
      R.none(
        ([i,j]) =>
          i < 0
          || i >= cols
          || (
            0 > R.findIndex(([ib,jb]) => ib===i && jb===j, posOrigPoints)
            && R.defaultTo('', bucket[i]?.[j]) !== 0
          )
      )

const makeKick =
    ks =>
      (k =>
        R.map(([i,j]) => [i+k[0], j+k[1]])
      )(
        [ks[0][0]-ks[1][0], ks[0][1]-ks[1][1]]
      )

const rot1 =
  (isOpenB, cw, posOrigPoints, unOPPoints) =>
    (kixx, points) =>
      R.cond([
        [
          ([, unoPRotoPoints]) => !isFloored(unoPRotoPoints) && isOpenB(posOrigPoints)(unoPRotoPoints),
          ([rotoPoints]) => [false, rotoPoints]
        ],
        ...R.map(
          kixn =>
            (kick =>
              [
                ([, unoPRotoPoints]) =>
                  (unoPKRotoPoints =>
                    !isFloored(unoPKRotoPoints) && isOpenB(posOrigPoints)(unoPKRotoPoints)
                  )(kick(unoPRotoPoints)),
                ([rotoPoints]) => {
                  console.log('kixn', kixn)
                  return [false, kick(rotoPoints)]
                }
              ]
            )(makeKick(kixn)),
          kixx
        ),
        [R.T, R.always([true, points])]
      ])(
        (rotPoints => [
          rotPoints,
          unOPPoints(rotPoints)
        ])(
          R.map(
            R.cond([
              [
                ([i,j]) => (i > 0 && j > 0) || (i < 0 && j < 0),
                quadrots[cw ? 0 : 1]
              ],
              [
                ([i,j]) => (i > 0 && j < 0) || (i < 0 && j > 0),
                quadrots[cw ? 1 : 0]
              ],
              [
                ([i,j]) => i === 0 && j !== 0,
                quadrots[cw ? 2 : 3]
              ],
              [
                ([i,j]) => i !== 0 && j === 0,
                quadrots[cw ? 3 : 2]
              ],
              [
                R.T,
                R.identity
              ]
            ]),
            points
          )
        )
      )

const rot = (isOpenB, n, actiTet) => {
  const {kind, pos: [x,y]} = actiTet

  const cw = n>0

  const r = kind === 'I' ? 2 : 1

  const origPoints =
    R.map(
      ([i, j]) => [i - r, j - r],
      actiTet.points
    )
  const posOrigPoints =
    R.map(
      ([i, j]) => [i + x, j + y],
      actiTet.points
    )

  const unOrigPoints = R.map(([i, j]) => [i + r, j + r])
  const unOPPoints = R.map(([i, j]) => [i + r + x, j + r + y])

  const rot1b = rot1(isOpenB, cw, posOrigPoints, unOPPoints)

  const kix = kicks[kind]

  const incRoto =
    cw ? R.ifElse(
      R.equals(3),
      R.always(0),
      R.add(1)
    ) : R.ifElse(
      R.equals(0),
      R.always(3),
      R.add(-1)
    )

  const maybeRot1 =
    params => {
      const [collided, roto, points] = params
      if (collided) return params

      const nextRoto = incRoto(roto)
      const [collided2, rotoPoints] = rot1b(R.transpose([kix[roto],kix[nextRoto]]), points)
      return collided2 ? [collided2, roto, points] : [collided2, nextRoto, rotoPoints]
    }

  const [, nextRot, rotoPoints] =
    R.apply(R.compose)(
      R.repeat(maybeRot1, Math.abs(n % 4))
    )([false, actiTet.rot, origPoints])

  return nextRot === actiTet.rot
    ? actiTet
    : R.compose(
      R.set(R.lensProp('rot'), nextRot),
      R.set(R.lensProp('points'), unOrigPoints(rotoPoints))
    )(actiTet)
}

const applyPos =
  R.chain(
    ([x,y]) =>
      R.compose(
        R.map(([i,j]) => [i+x,j+y]),
        R.prop('points')
      ),
    R.prop('pos')
  )

const isFlooredAtPos =
  R.compose(
    isFloored,
    applyPos
  )

const isOverlap =
  (bucket, maybeActiTet, prevActiTet) =>
    ((maybeActiPoints, prevActiPoints) =>
      R.any(
        ([i,j]) =>
          0 > R.findIndex(([ib,jb]) => ib===i && jb===j, prevActiPoints)
           && R.defaultTo('', bucket[i]?.[j]) !== 0
        )(maybeActiPoints)
    )(
      applyPos(maybeActiTet),
      applyPos(prevActiTet)
    )

const isCollision =
  (bucket, maybeActiTet, prevActiTet) =>
    isFlooredAtPos(maybeActiTet) || isOverlap(bucket, maybeActiTet, prevActiTet)

export const fall =
  R.chain(
    ([bucket, prevActiTet]) =>
      R.chain(
        fellActiTet =>
          state =>
            isCollision(bucket, fellActiTet, prevActiTet)
              ? [state, false]
              : [
                R.compose(
                  R.set(R.lensPath(['game', 'actiTet']), fellActiTet),
                  drawPoints(fellActiTet),
                  clearPoints(prevActiTet)
                )(state),
                true
              ],
        () =>
          R.over(
            R.lensPath(['pos', 1]),
            R.add(-1)
          )(prevActiTet)
      ),
    R.juxt([
      R.path(['game', 'bucket']),
      R.path(['game', 'actiTet'])
    ])
  )

const rotate =
  n =>
    R.chain(
      ([bucket, cols, actiTet]) =>
        R.chain(
          nextActiTet =>
            R.chain(
              isDirty =>
                isDirty ? R.compose(
                    drawPoints(nextActiTet),
                    clearPoints(actiTet),
                    R.set(R.lensPath(['game', 'actiTet']), nextActiTet)
                  ) : R.identity,
              () => nextActiTet.rot !== actiTet.rot
            ),
            () => rot(isOpen(cols, bucket), n, actiTet)
        ),
      R.juxt([
        R.path(['game', 'bucket']),
        R.path(['game', 'size', 0]),
        R.path(['game', 'actiTet'])
      ])
    )

export const leftRot = rotate(-1)

export const riteRot = rotate(1)

const translate =
  (axIndex, op) =>
    state =>
      (([actiTet, nextActiTet]) =>
          R.compose(
            drawPoints(nextActiTet),
            R.set(R.lensPath(['game', 'actiTet']), nextActiTet),
            clearPoints(actiTet)
          )(state)
      )((
        actiTet => [
          actiTet,
          R.over(
            R.lensPath(['pos', axIndex]),
            op
          )(actiTet)
        ]
      )(
        R.path(['game', 'actiTet'])(state)
      ))

export const left = translate(0, R.add(-1))

export const rite = translate(0, R.add(1))

export const up = translate(1, R.add(1))

export const down = translate(1, R.add(-1))
