const logLevel = {
  error: 5,
  warn: 4,
  info: 3,
  debug: 2,
  trace: 1,
}

const rows = 20
const cols = 10

export default {
  rows,
  cols,
  bucketBufferSize: 6,
  aspectRatio: {
    matrix: rows / cols,
    game: 0.448598, // tbd
  },
  matrixStyle: {
    default: 0,
    annotated: 1,
  },
  dbg: {
    pass: logLevel.info,
  },
  logLevel,
}
