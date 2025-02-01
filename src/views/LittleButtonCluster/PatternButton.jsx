import { useDispatch } from 'react-redux'

import thunks from '../../state/thunks'

import LittleButton from './LittleButton'

export default () => {
  const dispatch = useDispatch()

  const onPress = () => dispatch(thunks.testPattern())

  return <LittleButton text="pattern" onPress={onPress} />
}
