import {Users} from '../models/users'


import { Request, Response } from "express"

export const privateAction = async (req:Request, res:Response, next:any)=> {
    console.log(req.body)
    
    if (!req.query.token && !req.body.token) {
        res.json({ notallowed: true })
        return
    } 


    let token = ''
    
    if (req.query.token) {
        token = req.query.token as any
    }
    if (req.body.token) {
        token = req.body.token as any
    }

    if (req.fields?.token) {
        token = req.fields.token as any
    }

    if (token == '') {
        res.json({ notallowed: true })
        return
    }

    const user = await Users.findOne({where: {token}})

    if (!user) {
        res.json({ notallowed: true })
        return
    } 
    next()

}