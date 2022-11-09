import { Request, Response, Router } from "express";
import * as userController from '../controllers/userController'
import * as authController from '../controllers/authController'
import * as adsController from '../controllers/adsController'
import { privateAction } from '../middlewares/auth'

import * as userValidator from '../validators/userValidator'
import * as authValidator from '../validators/authValidator'
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, '../tmp' )
    },
    filename: (req, file, cb)=> {
        cb(null, file.fieldname+'-'+Date.now()+'.jpg')
    }
})


const upload = multer({ storage: storage })

const router = Router()

router.get('/ping', (req:Request, res:Response)=> {
    res.json({pong:true})
})

router.get('/states', userController.getStates)

router.post('/user/signin', authValidator.signIn, authController.signIn)
router.post('/user/signup', authValidator.signUp, authController.signUp)

router.get('/user/me', privateAction, userController.info)
router.put('/user/me',userValidator.editAction, privateAction,  userController.editAction)

router.get('/categories', adsController.getCategories)
router.post('/ad/add', privateAction, upload.array('photos', 6), adsController.addAction)
router.get('/ad/list', adsController.getList)
router.get('ad/item', adsController.getItem)
router.post('ad/:id', privateAction, adsController.editAction)

export default router