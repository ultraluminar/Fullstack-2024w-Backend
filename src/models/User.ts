import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { MinLength, MaxLength, IsEmail, validate } from "class-validator";
import { hash, compare } from "bcrypt";
import jwt from 'jsonwebtoken';
import { CreateUser } from "./CreateUser.js";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 30})
    @MinLength(3, { message: "Username is too short" })
    @MaxLength(30, { message: "Username is too long" })
    username: string

    @Column()
    password_hash: string

    @Column("text")
    @IsEmail()
    email: string

    @Column()
    created_at: Date

    static async fromCreateUser(createUser: CreateUser): Promise<User> {
        const user = new User();
        user.username = createUser.username;
        user.email = createUser.email;
        user.password_hash = await hash(createUser.password, 10);
        user.created_at = new Date();
        return user;
    }

    static decodeToken(token: string): jwt.JwtPayload | string | null {
        const secret = process.env.JWT_SECRET!;
        try {
            return jwt.verify(token, secret);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async validate(): Promise<boolean> {
        const errors = await validate(this);
        return errors.length === 0;
    }

    async authenticate(password: string): Promise<boolean> {
        return await compare(password, this.password_hash);
    }

    generateToken(): string {
        const payload = {userId: this.id, username: this.username};
        const secret = process.env.JWT_SECRET!;
        const options = {expiresIn: '1h'};
        return jwt.sign(payload, secret, options);
    }
}