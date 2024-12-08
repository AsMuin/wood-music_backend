import CF_upload from '@/config/cloudFlare';
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

const userUpdateAvatar: controllerAction = async (req, res) => {
    try {
        const {userId} = req.body;
        const avatarImage = req.file;
        const getResponse = apiResponse(res);
        if (!avatarImage) {
            return getResponse(false, '请上传头像');
        } else {
            const user = await User.findById(userId);
            if (!user) {
                return getResponse(false, '用户不存在');
            } else {
                const avatarUrl = await CF_upload(avatarImage.buffer, avatarImage.originalname);
                if (!avatarUrl) {
                    return getResponse(false, '上传头像失败');
                } else {
                    user.avatar = avatarUrl;
                    await user.save();
                    return getResponse(true, '头像上传成功', {
                        data: {
                            avatar: user.avatar,
                            name: user.name,
                            email: user.email
                        }
                    });
                }
            }
        }
    } catch (error: any) {
        console.error(error);
        apiResponse(res)(false, error.message);
    }
};

const userInfo: controllerAction = async (req, res) => {
    try {
        const {userId} = req.body;
        const getResponse = apiResponse(res);
        const user = await User.findById(userId);
        if (!user) {
            return getResponse(false, '用户不存在');
        } else {
            return getResponse(true, '获取用户信息成功', {
                data: {
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar ?? ''
                }
            });
        }
    } catch (error: any) {
        console.error(error);
        apiResponse(res)(false, error.message);
    }
};

const updateUserInfo: controllerAction = async (req, res) => {
    try {
        const {userId, name, email, originalPassword, password, confirmPassword} = req.body;
        const getResponse = apiResponse(res);
        const user = await User.findById(userId);
        //用户是否存在
        if (!user) {
            return getResponse(false, '用户不存在');
        }
        //密码是否正确
        if (password && confirmPassword && originalPassword) {
            if (password !== confirmPassword) {
                return getResponse(false, '两次密码输入不一致');
            }
            const isMatch = await bcrypt.compare(originalPassword, user.password);
            if (!isMatch) {
                return getResponse(false, '原密码错误');
            }
        }
        //更新用户信息
        user.name = name;
        user.email = email;
        user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
        await user.save();
        return getResponse(true, '更新用户信息成功', {
            data: {
                name: user.name,
                email: user.email,
                avatar: user.avatar ?? ''
            }
        });
    } catch (error: any) {
        console.error(error);
        apiResponse(res)(false, error.message);
    }
};
export {userLogin, userRegister, userUpdateAvatar, userInfo, updateUserInfo};
