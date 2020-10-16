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

const getWriteRanges =
  maxWriteTo =>
    R.compose(
      R.chain(
        indexes => ranges => R.transpose([indexes, ranges]),
        R.compose(
          R.times(R.identity),
          R.length
        )
      ),
      R.aperture(2),
      R.append(maxWriteTo),
      R.prepend(0)
    )

export const clearRows =
  (cols, rows, rowsToClear) =>
    bucket => {
      const maxWriteRow = rows + 2

      const writeRanges = getWriteRanges(maxWriteRow)(rowsToClear)

      const safeGetVal = (c, r) => r < maxWriteRow ? bucket[c][r] : 0

      R.forEach(
        ([numRowsCleared, [start, end]]) => {
          if (numRowsCleared === 0) return

          for (let row = start; row < end; row++) {
            for (let col = 0; col < cols; col++) {
              bucket[col][row] = safeGetVal(col, row + numRowsCleared)
            }
          }
        },
        writeRanges
      )

      return bucket
    }
