import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import apiRoutes from './routes/api'



dotenv.config()

const server = express()
server.use(express.json())
server.use('/public', express.static(path.join(__dirname, '../public')))
server.use(express.urlencoded({ extended: true }));



server.use(cors())

server.use(apiRoutes)

server.use((req:Request, res:Response)=> {
    res.status(404)
    res.json('endpoint não encontrado')
})

server.listen(process.env.PORT)