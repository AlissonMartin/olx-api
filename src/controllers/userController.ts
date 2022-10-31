import { Request, Response } from 'express'
import { States } from '../models/states'

export const getStates = async(req:Request, res:Response)=> {
    let states = await States.findAll()
    res.json({states})
}

export const info = async (req:Request, res:Response)=> {
    
}

export const editAction = async (req: Request, res: Response) => {

}