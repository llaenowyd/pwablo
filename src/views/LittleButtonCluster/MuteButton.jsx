import { useDispatch, useSelector } from 'react-redux'
import * as R from 'ramda'

import { actions } from '../../state/actions'

import LittleButton from './LittleButton'

export default () => {
  const dispatch = useDispatch()
  const musicEnabled = useSelector(R.path(['audio', 'music', 'enabled']))

  const onPress = () => dispatch({ type: actions.toggleMusic })

  return <LittleButton text={musicEnabled ? 'mute' : 'song'} onPress={onPress} />
}
