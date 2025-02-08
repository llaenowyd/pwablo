import * as R from 'ramda'

import constants from './constants'

const makeDbg = (dc, ll) => R.ifElse(
  R.either(
    R.isNil,
    R.lt(ll)
  ),
  R.always(() => R.identity),
  R.always(tag => R.tap(
    (...args) =>
      (R.cond([
        [
          R.equals(constants.logLevel.error),
          R.always(console.error),
        ],
        [
          R.equals(constants.logLevel.warn),
          R.always(console.warn),
        ],
        [
          R.T,
          R.always(console.log),
        ],
      ])(ll))(dc, tag, ...args)
  ))
)(constants.dbg?.pass)

/**
 * dbg - tapped log routines
 *   dbg.I('breadcrumb') ->
 *       f: f(args) returns args and logs "I breadcrum {args}"
 *          when info level logs are configured to passthrough
 *       R.identity
 *          otherwise
 */
export default R.compose(
  R.fromPairs,
  R.map(
    R.compose(
      R.adjust(0, R.head),
      R.adjust(1, R.apply(makeDbg)),
      R.flip(R.repeat)(2)
    ))
  )([
    ['E', constants.logLevel.error],
    ['W', constants.logLevel.warn],
    ['I', constants.logLevel.info],
    ['D', constants.logLevel.debug],
    ['T', constants.logLevel.trace],
  ])
