import startTick from '~/state/thunks/tick/start-tick'

import * as R from 'ramda'

import { actions } from '~/state'
import tick from '~/state/thunks/tick/tick'

describe('startTick', () => {
  const NOW = 1700000000000
  const INTERVAL = 66.7 // tbd
  const timeout0 = 1234
  const timeout1 = 2345
  const dateNowSpy = jest.spyOn(global.Date, 'now').mockImplementation(R.always(NOW))
  const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation(R.always(timeout1))
  
  let state = {
    tick: {
      mode: 'pattern',
      interval: INTERVAL,
      idle: false,
      next: timeout0, // tbd
      prevT0: NOW - 15,
    },
  }

  const getState = jest.fn(R.always(state))
  const dispatch = jest.fn(
    (action) => {
      if (R.equals('Function', R.type(action))) {
        return
      }

      const { type, payload } = action
      expect(type).toEqual(actions.setTick)
      state = R.set(R.lensProp('tick'), payload, state)
    })

  it('sets a timeout to call `tick`', () => {
    startTick('game')(dispatch, getState)

    expect(state).toEqual({
      tick: {
        mode: 'game',
        interval: INTERVAL,
        idle: false,
        next: timeout1, // tbd
        prevT0: NOW,
      },
    })

    expect(getState).toHaveBeenCalledTimes(1)
    expect(dateNowSpy).toHaveBeenCalledTimes(1)
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1)
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), INTERVAL)
    expect(dispatch).toHaveBeenCalledTimes(1)

    const [callback] = setTimeoutSpy.mock.calls[0]
    callback()
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenNthCalledWith(2, tick)
  })
})
