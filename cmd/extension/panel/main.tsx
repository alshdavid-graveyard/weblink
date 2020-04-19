import './main.scss'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Navbar, NavbarItem, TabOutlet, Tab } from './components'
import { useIncomingState } from './hooks'
import { WeblinkPage } from './pages'

enum Tabs {
  Weblink = 'Weblink',
  Router = 'Router',
}

const App = () => {
  const [currentTab, setTab] = useState<Tabs>(Tabs.Weblink)
  const state = useIncomingState()

  return <div className="container-root">
    <Navbar>
      {Object.values(Tabs).map(tab => 
        <NavbarItem 
          onClick={() => setTab(tab)}
          isSelected={currentTab === tab}>
          {tab}
        </NavbarItem>)}
    </Navbar>
    <TabOutlet currentTab={currentTab}>
      <Tab 
        tab={Tabs.Weblink} 
        render={<WeblinkPage state={state} />} />
      <Tab 
        tab={Tabs.Router} 
        render={<div />} />
    </TabOutlet>
  </div>
} 

ReactDOM.render(<App />, document.getElementById('outlet')!)