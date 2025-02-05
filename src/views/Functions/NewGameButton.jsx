import { useDispatch } from 'react-redux'

import thunks from '~/state/thunks/'

import FunctionButton from './FunctionButton'

export default ({size}) => {
  const dispatch = useDispatch()

  const onPress = () => dispatch(thunks.newGame())

  return <FunctionButton size={size} text="new game" onPress={onPress} />
}
