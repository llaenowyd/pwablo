
import { getEmptyBucket, getRandomFill } from '../bucket'

export const getInitialState = (rows=20, cols=10) => ({
  game: {
    size: [rows, cols],
    nextPiece: null,
    rotation: 0,
    bag: [],
    bucket: getEmptyBucket(rows, cols)
  },
  style: {
    matrix: 0
  },
  tick: {
    mode: null,
    idle: true,
    next: null,
    prevT0: null,
    skewDiagnostic: null,
    interval: 100
  },
  diagnostic: null,
  timer: {
    t0: null,
    t1: null
  }
})
