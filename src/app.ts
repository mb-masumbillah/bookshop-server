import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './routes'

const app: Application = express()

// parser
app.use(express.json())
app.use(cors())

// route
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})





export default app
