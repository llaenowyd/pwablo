import React from 'react'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
  
export default ({name, size, color}) => (
    Icon => Icon ? <Icon size={size} color={color} /> : <div>icon({name})</div>
  )({
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
    rotl: RotateCcw,
    rotr: RotateCw,
  }[name])
