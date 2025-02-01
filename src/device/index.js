import { useContext } from 'react'

import Device, { DeviceContext } from './DeviceContext'

export const useDevice = () => useContext(DeviceContext)

export default Device
