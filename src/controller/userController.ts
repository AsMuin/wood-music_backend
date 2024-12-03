import User from '@/model/userModel';
import apiResponse from '@/utils/response';
import bcrypt from 'bcrypt';
import validator from 'validator';
import {controllerAction} from '.';
import {createToken} from '@/utils/userToken';

const userLogin: controllerAction = async (req, res) => {
    try {
        const {email, password} = req.body;
        const getResponse = apiResponse(res);
        if (!email || !password) {
            return getResponse(false, '登录信息不完整');
        } else {
            const user = await User.findOne({email});
            if (!user) {
                return getResponse(false, '用户不存在');
            } else {
                const token = createToken(user._id.toString());
                return getResponse(true, '登录成功', {
                    token,
                    data: {
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar ?? ''
                    }
                });
            }
        }
    } catch (error: any) {
        apiResponse(res)(false, error.message);
    }
};
const userRegister: controllerAction = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const getResponse = apiResponse(res);
        if (!name || !email || !password) {
            return getResponse(false, '注册信息不完整');
        } else {
            const user = await User.findOne({email});
            if (user) {
                return getResponse(false, '用户已存在');
            } else {
                if (!validator.isEmail(email)) {
                    return getResponse(false, '邮箱格式不正确');
                } else if (password.length < 9) {
                    return getResponse(false, '密码长度至少9位');
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password, salt);
                    const newUser = new User({
                        name,
                        email,
                        password: hashPassword
                    });
                    await newUser.save();
                    return getResponse(true, '注册成功');
                }
            }
        }
    } catch (e: any) {
        console.error(e);
        apiResponse(res)(false, e.message);
    }
};

export {userLogin, userRegister};
