import { useDispatch, useSelector } from 'react-redux'
import * as R from 'ramda'

import { actions } from '../../state/actions'

import FunctionButton from './FunctionButton'

export default ({size}) => {
  const dispatch = useDispatch()
  const musicEnabled = useSelector(R.path(['audio', 'music', 'enabled']))

  const onPress = () => dispatch({ type: actions.toggleMusic })

  return <FunctionButton size={size} text={musicEnabled ? 'mute' : 'song'} onPress={onPress} />
}
