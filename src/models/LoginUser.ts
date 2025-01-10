import { Request } from "express";
import { LoginUser as LoginUserInterface } from "../../../interface/login-user.js";

export class LoginUser implements LoginUserInterface {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    static fromRequest(request: Request): LoginUser | null {
        if (request.body?.username == null || request.body?.password == null) {
            return null;
        }
        return new LoginUser(request.body.username, request.body.password);
    }
}
