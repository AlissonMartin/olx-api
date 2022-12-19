import { Request, Response } from 'express'
import { Ads } from '../models/ads'
import { Categories } from '../models/categories'
import { States } from '../models/states'
import { Users } from '../models/users'
import { validationResult, matchedData } from "express-validator";
import bcrypt from 'bcrypt'
import sharp from 'sharp'
import fs from 'fs'

type updatesType = {
    name?: string,
    email?: string,
    state?: string,
    passwordHash?:string
}

export const getStates = async(req:Request, res:Response)=> {
    let states = await States.findAll()
    res.json({states})
}

export const info = async (req:Request, res:Response)=> {
    let adList = []
    let token = req.query.token
    let status = req.query.status ? req.query.status : 1

    const user = await Users.findOne({where: {token}})

    if (user) {
        const state = await States.findOne({where: {name: user.state}})
        const ads = await Ads.findAll({where: { idUser: user.id, status: status}})


        for (let i in ads) { 
            let images = ads[i].images.split(',')
            let defaultImage = images[0]
            const cat = await Categories.findByPk(ads[i].category)

            adList.push({
                id: ads[i].id,
                status: ads[i].status,
                image: `./public/media/${defaultImage}`,
                dateCreated: ads[i].dateCreated,
                title: ads[i].title,
                price: ads[i].price,
                priceNegotiable: ads[i].priceNegotiable,
                views: ads[i].views,
                category: cat?.id
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            state: state?.name,
            photo: `./public/media/${user.photo}`,
            ads: adList
        })
    }





}

export const editAction = async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.json({ error: errors.mapped() })
        return
    }

    const data = matchedData(req)
    const user = await Users.findOne({where: {token: data.token}})
    const file = req.file

    if (user) {
        
        if(data.name) {
            user.name = data.name
        }

        if(data.email) {
            const emailCheck = await Users.findOne({where: {email: data.email}})
            if (emailCheck) {
                res.json({error: 'Email ja existe'})
                return
            }

            user.email = data.email
        }

        if(data.state) {
            const stateCheck = await States.findOne({where: {name: data.state}}) // !!!!

            if (!stateCheck) {
                res.json({error: 'Estado não existe'})
                return
            }

            user.state = data.state
        }

        if(data.password) {
            user.passwordHash = await bcrypt.hash(data.password, 10)
        }

        if(file)  {
            await sharp(file.path).resize(500, 500).toFile(`./public/media/${file.filename}`)
            fs.unlink(`./tmp/${file.filename}`, (err) => {
                if (err) {
                    console.log('It failed')
                } else {
                    console.log('successfully deleted')
                }
            })
            user.photo = file.filename
        }
        user.save()

        res.json({})

    }

}