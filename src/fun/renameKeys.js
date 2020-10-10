import * as R from 'ramda'

const renameKeys =
  R.curry(
    (keysMap, obj) =>
      R.reduce(
        (accumulator, key) =>
          R.assoc(
            R.has(key, keysMap) ? keysMap[key] : key,
            obj[key],
            accumulator
          ),
        {},
        R.keys(obj)
      )
    )

export default renameKeys
