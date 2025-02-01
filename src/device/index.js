import { useContext } from 'react'

import DeviceProvider, { DeviceContext } from './DeviceContext'

export const useDevice = () => useContext(DeviceContext)

export { DeviceProvider }
