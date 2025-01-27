import { useContext } from 'react'

import Display, { DisplayContext } from './DisplayContext'

export const useDisplay = () => useContext(DisplayContext)

export default Display
