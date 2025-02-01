import { useDispatch } from 'react-redux'

import { actions } from '../../state/actions'

import LittleButton from './LittleButton'

export default () => {
  const dispatch = useDispatch()

  const onPress = () => dispatch({ type: actions.reset })

  return <LittleButton text="reset" onPress={onPress} />
}
