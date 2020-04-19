import './weblink.scss'
import React from "react"
import { State } from '~/platform/extension'

export type WeblinkPageProps = {
  state: State
}

export const WeblinkPage = ({ state }: WeblinkPageProps) => {
  return <main className="page-weblink">
    <section>
      { state.weblink.events.map(event => <div>
        <span>{event.from}</span> => <span>{event.to}</span>
        {event.body && <pre>{JSON.stringify(event.body, null, 2)}</pre>}
        <hr/>
      </div>)}
    </section>
  </main>
}
