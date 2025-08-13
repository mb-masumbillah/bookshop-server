import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './routes'
import globalHandler from './middleware/globalHandler'
import cookieParser from 'cookie-parser'

const app: Application = express()

// parser
app.use(express.json())
app.use(cookieParser())
app.use(cors())

// route
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})



// globalHandler
app.use(globalHandler)


export default app
