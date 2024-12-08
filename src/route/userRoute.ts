import express from 'express';
import {updateUserInfo, userInfo, userLogin, userRegister, userUpdateAvatar} from '@/controller/userController';
import multer from '@/middleware/multer';
import userAuth from '@/middleware/userAuth';

const userRouter = express.Router();

userRouter.post('/login', userLogin);
userRouter.post('/register', userRegister);
userRouter.post('/uploadAvatar', multer.single('image'), userAuth, userUpdateAvatar);
userRouter.get('/info', userAuth, userInfo);
userRouter.post('/updateUserInfo', userAuth, updateUserInfo);

export default userRouter;
