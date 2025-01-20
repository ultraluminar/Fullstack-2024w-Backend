import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, OneToMany, Relation } from "typeorm";
import { MinLength, MaxLength, IsEmail, IsNotEmpty } from "class-validator";
import { hash, compare } from "bcrypt";
import { CreateUser } from "./CreateUser.js";
import { Question } from "../question/Question.js";
import { Answer } from "../answer/Answer.js";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: false })
    isAdmin: boolean

    @Column({length: 30})
    username: string

    @Column()
    @IsNotEmpty({ message: "Passworthash darf nicht leer sein" })
    password_hash: string

    @Column("text")
    email: string

    @OneToMany(() => Question, (question) => question.user, { onDelete: "CASCADE" })
    questions: Relation<Question[]>

    @OneToMany(() => Answer, (answer) => answer.user, { onDelete: "CASCADE" })
    answers: Relation<Answer[]>

    @CreateDateColumn()
    createdAt: Date

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
