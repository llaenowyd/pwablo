import { useState } from 'react'

export default () => {
  const [appState, setAppState] = useState('active')

  return appState
}
