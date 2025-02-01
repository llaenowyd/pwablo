import { useDispatch } from 'react-redux'

import thunks from '../../state/thunks'

import FunctionButton from './FunctionButton'

export default ({size}) => {
  const dispatch = useDispatch()

  const onPress = () => dispatch(thunks.testPattern())

  return <FunctionButton size={size} text="pattern" onPress={onPress} />
}
