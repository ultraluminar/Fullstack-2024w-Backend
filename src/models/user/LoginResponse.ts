import { Response } from "express";
import { LoginResponse as LoginResponseInterface } from "../../../../interface/login-response.js"
import { Token } from "../Token.js";
import { User } from "./User.js";

export class LoginResponse implements LoginResponseInterface {
    static code = 200;
    token: string;

    static send(response: Response, user: User){
        const token = Token.generateFromUser(user);
        response.status(this.code).json({ token: token });
    }
}

export class RegisterRespone extends LoginResponse {
    static code = 201;
}
