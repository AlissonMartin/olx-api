import { Request, Response } from 'express'
import { validationResult, matchedData } from "express-validator";
import { States } from '../models/states';
import { Users } from '../models/users';
import  bcrypt, { hash }  from 'bcrypt'

export const signIn = async (req:Request, res:Response)=> {

}

export const signUp = async (req:Request, res:Response)=> {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.json({error: errors.mapped()})
        return
    }

    const data = matchedData(req)

    // Email validation
    const user = await Users.findOne({where: {
        email: data.email
    }})

    if (user) {
        res.json({ error: { email: { msg: 'Email ja cadastrado' }}})
        return 
    }

    // State validation
    const state = await States.findOne({where: {name: data.state}})

    if (!state) {
        res.json({error: {state: { msg: 'Estado não existe'}}})
    }

   // Password 

   const passwordHash = await hash(data.password, 10)

   // Token

   const payload = (Date.now() + Math.random()).toString()
   const token = await hash(payload, 10)

   // Creating new User

   const newUser =  await Users.create({
    name: data.name,
    email: data.email,
    passwordHash: passwordHash,
    token: token,
    state: data.state
   })

   res.json({token})
}