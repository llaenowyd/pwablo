import React from 'react'

import Sound from 'react-native-sound'
import useAppState from 'react-native-appstate-hook'

import { useDispatch, useSelector } from 'react-redux'

import * as R from 'ramda'

Sound.setCategory('Playback')

const getRnsSound =
  (list => {
    const listToNameAndFilenameList = R.map(name => [name, `${name}.wav`])

    const filenameToRnsSound =
      filename => new Sound(
        filename,
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) console.error(error.message)
        }
      )

    const catalogSounds =
      R.compose(
        R.map(
          R.nth(1)
        ),
        R.indexBy(R.nth(0)),
        R.map(
          R.over(
            R.lensIndex(1),
            filenameToRnsSound
          )
        ),
        listToNameAndFilenameList
      )

    const emptySound = {
      play: () => { },
      setNumberOfLoops: () => { },
      stop: () => { }
    }

    return (soundCatalog =>
      R.compose(
        R.defaultTo(emptySound),
        R.flip(R.prop)(soundCatalog)
      )
    )(
      catalogSounds(list)
    )
  })([
    'koro',
    'woow',
    'yayy'
  ])

export const SoundController =
  () => {
    const { appState } = useAppState()

    const dispatch = useDispatch()

    const music = useSelector(R.path(['audio', 'music']))
    const sounds = useSelector(R.path(['audio', 'sounds']))
    const tickIdle = useSelector(R.path(['tick', 'idle']))
    const tickMode = useSelector(R.path(['tick', 'mode']))

    const {track,prevTrack,enabled:musicEnabled} = music
    const {woow,yayy} = sounds

    React.useEffect(
      () => {
        if (musicEnabled && !tickIdle && tickMode === 'game' && appState === 'active')
          (sound => {
            sound.play()
            sound.setNumberOfLoops(-1)
          })(getRnsSound(track))
        else getRnsSound(track).stop()
      },
      [appState, musicEnabled, tickIdle, tickMode, track]
    )

    React.useEffect(
      () => {
        if (prevTrack) {
          getRnsSound(prevTrack).stop()
          dispatch({type:'prevSoundStopped'})
        }
      },
      [dispatch, prevTrack]
    )

    React.useEffect(
      () => {
        if (yayy > 0) getRnsSound('yayy').play()
      },
      [yayy]
    )

    React.useEffect(
      () => {
        if (woow > 0) getRnsSound('woow').play()
      },
      [woow]
    )

    return null
  }
