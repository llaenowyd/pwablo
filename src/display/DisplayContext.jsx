import { createContext, useState, useCallback, useEffect } from 'react'

export const DisplayContext = createContext()

export default ({children}) => {
  const [displayContext, setDisplayContext] = useState({
    width: null,
    height: null,
    ratio: null,
    scale: null,
  })

  const updateDimensions = useCallback(
    () => {
      const baseWidth = 375 // Example base width for scaling (e.g., iPhone 12 width)
      const ratio = window.innerWidth / window.innerHeight
      const scale = window.innerWidth / baseWidth

      setDisplayContext({
        width: window.innerWidth,
        height: window.innerHeight,
        ratio,
        scale,
      })
    }, [setDisplayContext])

  useEffect(
    () => {
      updateDimensions()

      window.addEventListener('resize', updateDimensions)

      return () => window.removeEventListener('resize', updateDimensions)
    }, [updateDimensions])

  return (
    <DisplayContext.Provider value={displayContext}>
      {children}
    </DisplayContext.Provider>
  )
}
