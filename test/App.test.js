import 'react-native'
import React from 'react'

jest.mock('react-native-sound', () => {
  class SoundMock {
    constructor(path, type, callback) {}
  }

  SoundMock.prototype.setVolume = jest.fn()
  SoundMock.prototype.setNumberOfLoops = jest.fn()
  SoundMock.prototype.play = jest.fn()
  SoundMock.prototype.stop = jest.fn()

  SoundMock.setCategory = jest.fn()

  return SoundMock
})

import App from '../src/App'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  renderer.create(<App />);
})
