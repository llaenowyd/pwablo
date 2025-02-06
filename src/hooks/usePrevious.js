import { useEffect, useRef} from 'react'

/**
 * usePrevious
 */
export default value => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
