import { Response } from "express";
import { LoginResponse as LoginResponseInterface } from "../../../../interface/login-response.js"
import { Token } from "../Token.js";
import { User } from "./User.js";

export class LoginResponse implements LoginResponseInterface {
    static token: string;

    static send(response: Response, user: User){
        this.token = Token.generateFromUser(user);
        response.status(201).json(this);
    }
}
