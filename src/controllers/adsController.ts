import { Request, Response } from 'express'
import { Categories } from '../models/categories'
import dotenv from 'dotenv'
import { Users } from '../models/users'
import { Ads } from '../models/ads'
import sharp from 'sharp'
import fs from 'fs'
import {Op} from 'sequelize'
import { States } from '../models/states'
import { off } from 'process'
import { userInfo } from 'os'


dotenv.config()

export const getCategories = async (req: Request, res: Response) => {
    const cats = await Categories.findAll()

    const categories = []

    for (let i in cats) {
        categories.push({name: cats[i].name,
            slug: cats[i].slug,
            img: `${process.env.BASE}/public/assets/images/${cats[i].slug}.png`
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
    let date = new Date()

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

        let images = []
        let files = req.files as Express.Multer.File[]

        for (let i in files) {
            await sharp(files[i].path).resize(500, 500).toFile(`./public/media/${files[i].filename}`)
            images.push(files[i].filename)
            fs.unlink(`./tmp/${files[i].filename}`, (err)=> {
                if (err) {
                    console.log('It failed')
                } else {
                    console.log('successfully deleted')
                }
            })
        }

        const newAd = new Ads()
        newAd.status = 1
        newAd.idUser = user.id
        newAd.state = user.state
        newAd.dateCreated = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
        newAd.title = title
        newAd.category = cat
        newAd.price = price
        newAd.priceNegotiable = (priceNeg == 'true') ? 1 : 0
        newAd.description = desc
        newAd.views = 0
        newAd.images = images.toString()

        const info = await newAd.save()
        
        
        res.json({id: info.id, title,price,desc,cat,token,images, priceNeg})

    } else {
        res.json({err: 'Usuário não encontrado'})
    }


}

export const getList = async (req: Request, res: Response) => {
    let sort = (req.query.sort) ? req.query.sort : 'asc'
    let offset:any = (req.query.offset) ? req.query.offset : '0'
    let order:any = (req.query.order) ? req.query.order : 'dateCreated'
    let status:any = (req.query.status) ? req.query.status : '1'
    let priceNeg:any = (req.query.priceNeg) 
    let q = (req.query.q) ? req.query.q : ''
    let cat = req.query.cat
    let state = req.query.state
    let limit:any = req.query.limit
    let filters:{[k: string]: any} = {status: 1}

    if (q) {
        filters.title = {[Op.like]: `%${q}%`}
    }

    if (cat) {
        const c = await Categories.findOne({where: {slug: cat}})
        if (c) {
            filters.category = c.name
        }
    }

    if (state) {
        const s = await States.findOne({where: {name: state}})
        if (s) {
            filters.state = s.name
        }
    }

    if (priceNeg) {
        parseInt(priceNeg)
        filters.priceNegotiable = priceNeg
    }

    parseInt(status)

    filters.status = status
    
    console.log(filters)
    const adsData = await Ads.findAll({
        where: filters,
        order: [[order, (sort == 'desc') ? 'DESC' : 'ASC']],
        limit: (limit) ? parseInt(limit) : 500,
        offset: parseInt(offset)
        })


    let ads = []

    for (let i in adsData) {
        let images = adsData[i].images.split(',')
        let defaultImage = images[0]
        ads.push({
            id: adsData[i].id,
            title: adsData[i].title,
            price: adsData[i].price,
            priceNegotiable: (adsData[i].priceNegotiable === 1) ?  true : false,
            image: `./public/media/${defaultImage}`
        })
    }

    res.json({ads})
}

export const getItem = async (req: Request, res: Response) => {
    const ad = await Ads.findByPk(req.params.id)
    if (!ad) {
        res.json({error: 'Anúncio não encontrado'})
        return
    }

    ad.views++
    ad.save()

    let img = ad.images.split(',')
    let images = []
    for (let i in img) {
        images.push(`./public/media/${img[i]}`)
    }

    let user = await Users.findByPk(ad.idUser)

    let cat = await Categories.findOne({where: {name: ad.category}})

    res.json({
        id:ad.id,
        title: ad.title,
        price: ad.price,
        priceNegotiable: ad.priceNegotiable,
        description: ad.description,
        dateCreated: ad.dateCreated,
        views: ad.views,
        images,
        category: cat?.slug,
        userInfo: {
            name: user?.name,
            email: user?.email
        },
        state: ad.state

    })
}

export const editAction = async (req: Request, res: Response) => {
    let id = req.params.id
    let title = req.body.title
    let status: '0' | '1' = req.body.status
    let price = req.body.price
    let priceNeg: '0' | '1' = req.body.priceNegotiable
    let desc = req.body.description
    let cat = req.body.category
    // let files = req.files as Express.Multer.File[]
    let token = req.body.token

    let ad = await Ads.findByPk(id)

    if (!ad) {
        res.json({ error: 'Anúncio não existe' })
        return
    }

    let user = await Users.findByPk(ad.idUser)
    if (user?.token !== token) {
        res.json({error: 'Você não tem permissão'})
        return
    }

    if (title) {
        ad.title = title
    }
    if (price) {
        price = price.replace('.', '').replace(',', '.').replace('R$ ', '')
        price = parseFloat(price)
        ad.price = price
    }
    if (priceNeg) {
        ad.priceNegotiable = parseInt(priceNeg)
    }
    if(status) {
        ad.status = parseInt(status)
    }
    if (desc) {
        ad.description = desc
    }
    if (cat) {
        let c = await Categories.findOne({where: {name: cat}})
        if (c) {
            ad.category = cat
        }
    }

    // let images = []

    // if (files) {
    //     for (let i in files) {
    //         await sharp(files[i].path).resize(500, 500).toFile(`./public/media/${files[i].filename}`)
    //         images.push(files[i].filename)
    //         fs.unlink()
    //     }
    // }


    await ad.save()

    res.json('Atualizado com sucesso')



    



}