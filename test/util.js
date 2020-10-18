

export const makeEmptyBucket = (cols, rows, tetKind=0) => {
  const result = []

  for (let i = 0; i < cols; i++) {
    result.push([])
    const ri = result.length - 1

    for (let j = 0; j < rows; j++) {
      result[ri].push(tetKind)
    }
  }

  return result
}
