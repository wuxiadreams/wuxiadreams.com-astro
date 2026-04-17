import * as React from "react"

export function useLazyRef<T>(init: () => T) {
  const ref = React.useRef<T>(undefined as any)
  if (ref.current === undefined) {
    ref.current = init()
  }
  return ref as React.MutableRefObject<T>
}
