import React from 'react'

import Sound from 'react-native-sound'

import { useDispatch, useSelector } from 'react-redux'

import * as R from 'ramda'

Sound.setCategory('Playback')

const sounds = {}

try {
  sounds.koro = new Sound(
    'korobeiniki2.wav',
    Sound.MAIN_BUNDLE,
    (error) => {
      if (error) console.error(error.message)
    }
  )
} catch (e) {
  console.error(e.message)
}

export const SoundController =
  () => {
    const dispatch = useDispatch()
    const {music:{track,prevTrack,enabled:musicEnabled}} = useSelector(R.prop('audio'))
    const tickIdle = useSelector(R.path(['tick', 'idle']))
    const tickMode = useSelector(R.path(['tick', 'mode']))

    React.useEffect(
      () => {
        if (musicEnabled && !tickIdle && tickMode === 'game') {
          if (track === 'koro')
            sounds.koro.play()
            sounds.koro.setNumberOfLoops(-1)
        }
        else {
          if (track === 'koro')
            sounds.koro.stop()
        }
      },
      [musicEnabled, tickIdle, tickMode, track]
    )

    React.useEffect(
      () => {
        if (prevTrack) {
          const sound = sounds[prevTrack]
          if (sound) {
            sound.stop()
          }
          dispatch({type:'prevSoundStopped'})
        }
      },
      [dispatch, prevTrack]
    )

    return null
  }
