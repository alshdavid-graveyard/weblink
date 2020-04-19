import crayon from 'crayon'
import { home } from './home'
import { iframe } from './iframe'

const app = crayon.create()

app.path('/', _ctx => home())
app.path('/iframe', _ctx => iframe())

app.load()