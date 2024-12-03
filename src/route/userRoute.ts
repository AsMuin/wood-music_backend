import express from 'express';
import {userLogin, userRegister} from '@/controller/userController';

const userRouter = express.Router();

userRouter.post('/login', userLogin);
userRouter.post('/register', userRegister);

export default userRouter;
