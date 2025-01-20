import { MinLength, IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { User } from "../user/User.js";
import { Question } from "../question/Question.js";
import { CreateAnswer } from "./CreateAnswer.js";

@Entity()
export class Answer extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    @MinLength(10, { message: "Antwortbody ist zu kurz" })
    @IsNotEmpty({ message: "Antwortbody darf nicht leer sein" })
    body: string

    @ManyToOne(() => User, (user) => user.answers, { onDelete: "CASCADE" })
    user: Relation<User>

    @ManyToOne(() => Question, (question) => question.answers, { onDelete: "CASCADE" })
    question: Relation<Question>

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    getVotes(): number {
        // TODO: implement
        return 69;
    }

    static fromCreateAnswer(createAnswer: CreateAnswer, user: User, question: Question): Answer{
        return Answer.create({
            body: createAnswer.body,
            user: user,
            question: question,
        });
    }
}
