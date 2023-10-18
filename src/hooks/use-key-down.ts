import { useEffect } from 'react'

const useKeyDown = (handler: (event: KeyboardEvent) => void) => {
  useEffect(() => {
    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [handler])
}

export default useKeyDown
