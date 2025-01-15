import { MinLength, IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { User } from "../user/User.js";
import { Question } from "../question/Question.js";

export class Answer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    @MinLength(10, { message: "Antwortbody ist zu kurz" })
    @IsNotEmpty({ message: "Antwortbody darf nicht leer sein" })
    body: string

    @ManyToOne(() => User, (user) => user.answers)
    user: Relation<User>

    @ManyToOne(() => Question, (question) => question.answers)
    question: Relation<Question>

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    getVotes(): number {
        // TODO: implement
        return 69;
    }
}