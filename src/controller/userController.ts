import User from "@/model/userModel";
import { controllerAction } from ".";
import apiResponse from "@/utils/response"
import { createToken } from "@/utils/userToken"
const userLogin: controllerAction = async (req, res) => {
    try {
        const { email, password } = req.body;
        const getResponse = apiResponse(res);
        if (!email || !password) {
            return getResponse(false, "登录信息不完整")
        } else {
            const user = await User.findOne({ email })
            if (!user) {
                return getResponse(false, "用户不存在")
            } else {
                const token = createToken(user._id.toString())
                return getResponse(true, "登录成功", {
                    token,
                    data: {
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar ?? ""
                    }
                })
            }
        }
    } catch (error: any) {
        apiResponse(res)(false, error.message)
    }

}


export { userLogin }