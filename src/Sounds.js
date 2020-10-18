import React from 'react'

import Sound from 'react-native-sound'

import { useDispatch, useSelector } from 'react-redux'

import * as R from 'ramda'

import { usePrevious } from './hooks/usePrevious'

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
  sounds.woow = new Sound(
    'woow.wav',
    Sound.MAIN_BUNDLE,
    (error) => {
      if (error) console.error(error.message)
    }
  )
  sounds.yayy = new Sound(
    'yayy.wav',
    Sound.MAIN_BUNDLE,
    (error) => {
      if (error) console.error(error.message)
    }
  )
  sounds.pacman_intro = new Sound(
    'pacman_outro.wav',
    Sound.MAIN_BUNDLE,
    (error) => {
      if (error) console.error(error.message)
    }
  )
  sounds.pacman_outro = new Sound(
    'pacman_outro.wav',
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
    const gameLevel = useSelector(R.path(['game', 'level']))
    const completedRows = useSelector(R.path(['game', 'completedRows']))

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

    const prevGameLevel = usePrevious(gameLevel)
    React.useEffect(
      () => {
        if (musicEnabled && gameLevel !== prevGameLevel && gameLevel > 1) {
          const sound = sounds.yayy
          if (sound) sound.play()
        }
      },
      [gameLevel, musicEnabled, prevGameLevel]
    )

    React.useEffect(
      () => {
        if (musicEnabled && R.length(completedRows) === 4) {
          const sound = sounds.woow
          if (sound) sound.play()
        }
      }
    )

    return null
  }
