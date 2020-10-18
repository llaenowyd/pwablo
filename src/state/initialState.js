import * as R from 'ramda'
import { getEmptyBucket } from '../bucket'

const tickRate = 15 // ticks/s
const baseClockRate = 12 // base ticks/clock

export const initialActiTet = {
  kind: null,
  points: [],
  pos: [0,0],
  rot: 0,
  dropping: false
}

export const getInitialState = (rows=20, cols=10) =>
  ({
    audio: {
      music: {
        track: 'koro',
        prevTrack: null,
        enabled: true
      }
    },
    clock: {
      diagnostic: null,
      rate: baseClockRate
    },
    game: {
      actiTet: initialActiTet,
      bag: [],
      bucket: getEmptyBucket(rows, cols),
      clock: baseClockRate,
      completedRows: [],
      finished: false,
      flash: R.repeat({timer: null, animation: null}, rows),
      level: 1,
      nextTet: null,
      rowsCleared: 0,
      rowsPerLevel: 10,
      score: null,
      size: [cols, rows]
    },
    input: [],
    style: {
      matrix: 0
    },
    tick: {
      idle: true,
      interval: Math.floor(1000 / tickRate),
      mode: null,
      next: null,
      prevT0: null,
      skewDiagnostic: null
    }
  })
