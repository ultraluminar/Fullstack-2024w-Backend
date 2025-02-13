import { Request } from "express";
import { SignOptions } from "jsonwebtoken";

import jwt from 'jsonwebtoken';
import { User } from "./user/User.js";

const options: SignOptions = { expiresIn: '1h' };

export class Token {
    userId: number;

    constructor(userId: number){
        this.userId = userId;
    }

    static generateFromUser(user: User){
        const secret: jwt.Secret = process.env.JWT_SECRET!;
        return jwt.sign({ userId: user.id }, secret, options);
    }

    static fromRequest(request: Request): Token | null {
        const { authorization } = request.headers;
        if (authorization == null){
            return null;
        }
        const payload = Token.decode(authorization);
        const userId = payload?.userId;

        if (userId == null){
            return null;
        }
        return new Token(userId);
    }

    static decode(authorization: string): jwt.JwtPayload | null{
        if (!authorization.startsWith('Bearer ')){
            return null;
        }
        const token = authorization.slice(7);
        const secret: jwt.Secret = process.env.JWT_SECRET!;
        try {
            const payload = jwt.verify(token, secret);
            if (typeof payload === 'string'){
                return null;
            }
            return payload;
        } catch (error){
            console.error(error);
            return null;
        }
    }

    async isAutherizedUser(user: User){
        if (this.userId == user.id){
            return true;
        }
        const thisUser = await User.findOneBy({ id: this.userId })
        if (thisUser == null){
            return false;
        }
        return thisUser.isAdmin;
    }
}
