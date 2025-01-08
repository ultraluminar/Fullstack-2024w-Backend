import { LoginResponse as LoginResponseInterface } from "../../../interface/login-response.js"

export class LoginResponse implements LoginResponseInterface {
    token: string;

    constructor(token: string) {
        this.token = token;
    }
}
