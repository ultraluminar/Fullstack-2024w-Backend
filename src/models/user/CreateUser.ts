import { Request } from "express";
import { CreateUser as CreateUserInterface} from "../../../../interface/create-user.js";

export class CreateUser implements CreateUserInterface {
    username: string;
    email: string;
    password: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static fromRequest(request: Request): CreateUser | null {
        if (request.body?.username == null || request.body?.email == null || request.body?.password == null) {
            return null;
        }
        return new CreateUser(request.body.username, request.body.email, request.body.password);
    }
}
