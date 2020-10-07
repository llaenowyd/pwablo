import * as R from 'ramda'

const makeRange = (end, start = 0, step = 1) =>
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
              R.over(
                R.lensIndex(1),
                R.add(directedStep)
              ),
              R.flip(R.repeat)(2)
            )
        )(direction < 0 ? -1 * step : step)
      )
  )(
    step < 1
      ? (() => { throw new Error(`invalid step in makeRange: ${step}`) })()
      : end - start
  )

export default makeRange
