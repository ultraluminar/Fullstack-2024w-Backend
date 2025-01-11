import { IsNotEmpty, MaxLength, MinLength, validate } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, FindOptionsWhere, Like, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { User } from "./User.js";
import { CreateQuestion } from "./CreateQuestion.js";
import { Request, Response } from "express";

export enum Sort {
    newest = "newest",
    oldest = "oldest",
    votes = "votes",
}

const pageSize: number = 20;

@Entity()
export class Question extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 150})
    @MinLength(10, { message: "Titel ist zu kurz" })
    @MaxLength(150, { message: "Titel ist zu lang" })
    @IsNotEmpty({ message: "Titel darf nicht leer sein" })
    title: string

    @Column("text")
    @MinLength(10, { message: "Fragebody ist zu kurz" })
    @IsNotEmpty({ message: "Fragebody darf nicht leer sein" })
    body: string

    @ManyToOne(() => User, (user) => user.questions)
    user: Relation<User>

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    static fromCreateQuestionAndUser(createQuestion: CreateQuestion, user: User): Question{
        const question = new Question();
        question.title = createQuestion.title;
        question.body = createQuestion.body;
        question.user = user;
        return question;
    }

    static async countFromQuery(search: string): Promise<number> {
        return await Question.countBy({ title: Like(`%${search}%`) });
    }

    static async fromQuery(search: string, sort: Sort, page: number): Promise<Question[]>{
        const whereOptions: FindOptionsWhere<Question> = { title: Like(`%${search}%`) };
        const offset = (page - 1) * pageSize

        return await Question
            .createQueryBuilder()
            .where(whereOptions)
            .orderBy("question.createdAt", sort === Sort.newest ? "ASC" : "DESC")
            .offset(offset)
            .limit(pageSize)
            .execute();
    }

    async getVotes(): Promise<number>{
        // TODO: implement
        return 69;
    }

}
