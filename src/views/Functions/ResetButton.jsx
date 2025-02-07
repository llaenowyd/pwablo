import { useDispatch } from 'react-redux'

import { actions } from '~/state'

import FunctionButton from './FunctionButton'

export default ({size}) => {
  const dispatch = useDispatch()

  const onPress = () => dispatch({ type: actions.reset })

  return <FunctionButton size={size} text="reset" onPress={onPress} />
}
