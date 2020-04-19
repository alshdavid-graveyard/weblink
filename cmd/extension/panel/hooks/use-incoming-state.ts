import { useState, useEffect } from "react"
import { State } from "~/platform/extension"

export const useIncomingState = () => {
  const [state, setState] = useState<State>(new State())
  useEffect(() => window.addEventListener('message', e => setState({ ...e.data })), [window])  
  return state
}
