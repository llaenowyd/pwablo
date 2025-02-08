import constants from '~/constants'

const makeEmptyBucket = (cols, rows, bloKind='.') => {
  const result = []

  for (let i = 0; i < cols; i++) {
    result.push([])
    const ri = result.length - 1

    for (let j = 0; j < rows; j++) {
      result[ri].push(bloKind)
    }
  }

  return result
}

export default {
  constants,
  makeEmptyBucket,
}
