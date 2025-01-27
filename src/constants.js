const logLevel = {
  error: 5,
  warn: 4,
  info: 3,
  debug: 2,
  trace: 1,
}

export default {
  aspectRatio: {
    matrix: 0.5,
    game: 0.448598,
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
