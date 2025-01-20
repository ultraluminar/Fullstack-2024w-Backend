import { Request } from "express";
import { CreateUser as CreateUserInterface} from "../../../../interface/create-user.js";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUser implements CreateUserInterface {

    @MinLength(3, { message: "Benutzername ist zu kurz" })
    @MaxLength(30, { message: "Benutzername ist zu lang" })
    @IsNotEmpty({ message: "Benutzername darf nicht leer sein" })
    username: string;

    @IsEmail()
    @IsNotEmpty({ message: "Email darf nicht leer sein" })
    email: string;

    @MinLength(8, { message: "Passwort ist zu kurz"})
    @IsNotEmpty({ message: "Passwort darf nicht leer sein" })
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
