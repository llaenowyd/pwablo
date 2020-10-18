import {Animated, Easing} from 'react-native';

import * as R from 'ramda'

// flash
//   row -> {timer:(null|Animated.Value), animation: (null|Animated)}

let id = 0

const makeCompletedRowTimer =
  approxMsPerClock =>
    () =>
      R.applySpec({
        id: ++id,
        timer: R.identity,
        animation: timer => {
          const ani = Animated.sequence([
              Animated.timing(timer, {
                toValue: 1,
                delay: 15,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              }),
              Animated.timing(timer, {
                toValue: 0,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              }),
              Animated.timing(timer, {
                toValue: 1,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              }),
              Animated.timing(timer, {
                toValue: 0,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              }),
              Animated.timing(timer, {
                toValue: 1,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              }),
              Animated.timing(timer, {
                toValue: 0,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              }),
              Animated.timing(timer, {
                toValue: 1,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              }),
              Animated.timing(timer, {
                toValue: 0,
                duration: Math.floor(1/16 * approxMsPerClock),
                useNativeDriver: true,
                easing: Easing.linear
              })
              // Animated.timing(timer, {
              //   toValue: 100,
              //   duration: Math.floor(1/16 * approxMsPerClock),
              //   useNativeDriver: true,
              //   easing: Easing.exp
              // })
            ])
            // , { iterations: -1 } )

          ani.start()
          return ani
        }
      })(
        new Animated.Value(0)
      )

export const setFlash =
  completedRows =>
    R.isEmpty(completedRows)
    ? R.identity
    : state => {
        const tickInterval = R.path(['tick', 'interval'])(state)
        // const gameLevel = R.path(['game', 'level'])(state)
        //
        // const baseClockRate = 12
        // const clockRate = baseClockRate - gameLevel - 1
        // const approxMsPerClock = clockRate * tickInterval

        const makeCRT = makeCompletedRowTimer(tickInterval)

        return R.compose(
          ...R.map(
            row =>
              R.over(
                R.lensPath(['game', 'flash', row]),
                flash => {
                  const {animation} = flash
                  if (animation) animation.stop()
                  return makeCRT()
                }
              )
          )(
            completedRows
          )
        )(state)
      }

export const stopFlash =
  R.chain(
    completedRows =>
      R.over(
        R.lensPath(['game','flash']),
        flash => {
          R.forEach(
            row => {
              flash[row] = {timer: null, animation: null}
            }
          )(completedRows)
          return flash
        }
      ),
    R.path(['game', 'completedRows'])
  )
