import { useDispatch } from 'react-redux'

import thunks from '../../state/thunks'

import LittleButton from './LittleButton'

export default () => {
  const dispatch = useDispatch()

  const onPress = () => dispatch(thunks.newGame())

  return <LittleButton text="new game" onPress={onPress} />
}
