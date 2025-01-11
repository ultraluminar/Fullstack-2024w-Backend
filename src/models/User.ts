import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, OneToMany } from "typeorm";
import { MinLength, MaxLength, IsEmail, IsNotEmpty } from "class-validator";
import { hash, compare } from "bcrypt";
import jwt from 'jsonwebtoken';
import { CreateUser } from "./CreateUser.js";
import { Question } from "./Question.js";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 30})
    @MinLength(3, { message: "Benutzername ist zu kurz" })
    @MaxLength(30, { message: "Benutzername ist zu lang" })
    @IsNotEmpty({ message: "Benutzername darf nicht leer sein" })
    username: string

    @Column()
    @IsNotEmpty({ message: "Passworthash darf nicht leer sein" })
    password_hash: string

    @Column("text")
    @IsEmail()
    @IsNotEmpty({ message: "Email darf nicht leer sein" })
    email: string

    @OneToMany(() => Question, (question) => question.user)
    questions: Question[]

    @CreateDateColumn()
    created_at: Date

    static async fromCreateUser(createUser: CreateUser): Promise<User> {
        const user = new User();
        user.username = createUser.username;
        user.email = createUser.email;
        user.password_hash = await hash(createUser.password, 10);
        return user;
    }

    async authenticate(password: string): Promise<boolean> {
        return await compare(password, this.password_hash);
    }
}
