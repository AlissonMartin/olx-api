import { Request, Response } from 'express'
import { Categories } from '../models/categories'
import dotenv from 'dotenv'
import { Users } from '../models/users'
import { Ads } from '../models/ads'



dotenv.config()

export const getCategories = async (req: Request, res: Response) => {
    const cats = await Categories.findAll()

    const categories = []

    for (let i in cats) {
        categories.push({
            ...cats[i],
            img: `${process.env.BASE}/assets/images/${cats[i].slug}.png`
        })
    }

    res.json({categories})


}

export const addAction = async (req: Request, res: Response) => {
    let title = req.body.title
    let price =  req.body.price
    let desc = req.body.desc 
    let priceNeg = req.body.priceNeg
    let cat = req.body.cat 
    let token = req.body.token

    const user = await Users.findOne({where: {token}})

    if (user) {
        if (!title || !cat) {
            res.json({error: 'Adicione o titulo e a categoria'})
        }

        if(price) {
            price = price.replace('.', '').replace(',', '.').replace('R$ ', '')
            price = parseFloat(price)
        } else {
            price = 0
        }

        const newAd = new Ads()
        newAd.status = 1
        newAd.idUser = user.id
        newAd.state = user.state
        newAd.dateCreated = new Date()
        newAd.title = title
        newAd.category = cat
        newAd.price = price
        newAd.priceNegotiable = (priceNeg == 'true') ? 1 : 0
        newAd.description = desc
        newAd.views = 0

    } else {
        return
    }
}

export const getList = async (req: Request, res: Response) => {

}

export const getItem = async (req: Request, res: Response) => {

}

export const editAction = async (req: Request, res: Response) => {

}