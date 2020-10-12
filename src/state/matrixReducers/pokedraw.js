import * as R from 'ramda'

export const drawTetKind =
  state =>
    kind =>
      tet => {
        const {game:{bucket}} = state
        const {points,pos:[x,y]} = tet

        R.forEach(
          ([i,j]) => {
            bucket[x + i][y + j] = kind
          },
          points
        )

        return state
      }

export const drawBuckTetKind =
  state =>
    kind =>
      tet => {
        const {game:{bucket}} = state
        const {points} = tet

        R.forEach(
          ([i,j]) => {
            bucket[i][j] = kind
          },
          points
        )

        return state
      }

const makeDrawTet =
  bucketed =>
    (dele =>
        state =>
          tet => {
            const {kind} = tet

            return dele(state)(kind)(tet)
          }
    )(
      bucketed ? drawBuckTetKind : drawTetKind
    )

export const drawTet = makeDrawTet(false)
export const drawBuckTet = makeDrawTet(true)

const makeEraseTet =
  bucketed =>
    (dele =>
        state =>
          tet => dele(state)(0)(tet)
    )(
      bucketed ? drawBuckTetKind : drawTetKind
    )

export const eraseTet = makeEraseTet(false)
export const eraseBuckTet = makeEraseTet(true)

export const drawActiTet = state =>
  drawTet(state)(
    R.path(['game', 'actiTet'])(state)
  )
