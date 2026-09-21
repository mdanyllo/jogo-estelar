import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import { gameRouter } from './routes/game.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/game', gameRouter)

app.use((request, response) => {
  response.status(404).json({ error: 'NOT_FOUND' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'INTERNAL_ERROR' })
})

app.listen(config.port, () => {
  console.log(`Servidor rodando em http://localhost:${config.port}`)
})
