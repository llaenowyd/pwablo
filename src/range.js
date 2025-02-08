import * as R from 'ramda'

/**
 * range
 *   range(3) -> [0, 1, 2]
 *   range(-4, 2, 2) -> [2, 0, -2]
 * 
 * Or instead
 *   R.times(R.identity, 3) -> [0, 1, 2]
 */
export default (end, start = 0, step = 1) =>
  (direction =>
      ((isComplete, stepper) =>
          R.unfold(
            R.ifElse(
              isComplete,
              R.always(false),
              stepper
            ),
            start
          )
      )(
        direction > 0 ? R.lte(end) : R.gte(end),
        (directedStep =>
            R.compose(
              R.adjust(1, R.add(directedStep)),
              R.flip(R.repeat)(2)
            )
        )(direction < 0 ? -1 * step : step)
      )
  )(
    step < 1
      ? (() => { throw new Error(`invalid step ${step}`) })()
      : end - start
  )
