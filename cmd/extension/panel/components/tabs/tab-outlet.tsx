import { createContext, useContext, Fragment } from "react"
import React from "react"

export const TabContext = createContext({} as any)

export type TabOutletProps<T> = {
  currentTab: T
  children: any
}

export const TabOutlet = <T,>({
  currentTab,
  children,
}: TabOutletProps<T>) => <TabContext.Provider 
  value={currentTab}>
  {children}
  </TabContext.Provider>

export type TabProps<T> = {
  tab: T
  render?: any
  children?: any
}

export const Tab = <T,>({
  tab,
  render,
  children,
}: TabProps<T>) => {
  const output = children || render || <div />
  const currentTab = useContext(TabContext)
  return tab === currentTab ? output : <Fragment />
}