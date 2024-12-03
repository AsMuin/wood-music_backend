import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import apiResponse from "@/utils/response";
function userAuth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
        apiResponse(res)(false, '缺少用户凭证')
        return;
    }
    try {
        const token_decode:any = jwt.verify(authorization,process.env.JWT_SECRET as string)
    } catch (e: any) {
        console.error(e);
        apiResponse(res)(false, e.message)

    }
}