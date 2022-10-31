import { Request, Response, Router } from "express";
import * as userController from '../controllers/userController'
import * as authController from '../controllers/authController'
import * as adsController from '../controllers/adsController'
import { privateAction } from '../middlewares/auth'
import * as authValidator from '../validators/authValidator'


const router = Router()

router.get('/ping', (req:Request, res:Response)=> {
    res.json({pong:true})
})

router.get('/states', userController.getStates)

router.post('/user/signin', authController.signIn)
router.post('/user/signup', authValidator.signUp, authController.signUp)

router.get('/user/me', privateAction, userController.info)
router.put('/user/me', privateAction,  userController.editAction)

router.get('/categories', adsController.getCategories)

router.post('/ad/add', privateAction, adsController.addAction)
router.get('/ad/list', adsController.getList)
router.get('ad/item', adsController.getItem)
router.post('ad/:id', privateAction, adsController.editAction)

export default router