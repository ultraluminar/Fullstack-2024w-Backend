import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, ILike, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from "typeorm";
import { User } from "../user/User.js";
import { CreateQuestion } from "./CreateQuestion.js";
import { ParsedQs } from "qs";

export enum Sort {
    newest = "newest",
    oldest = "oldest",
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
        return await Question.countBy({ title: ILike(`%${search}%`) });
    }

    static async fromQuery(query: ParsedQs): Promise<Question[]>{
        const search = query.search as string || "";
        const sort = query.sort as Sort || Sort.newest;
        const page = Number(query.page) || 1;

        const offset = (page - 1) * pageSize

        return await Question.find(
            {
                where: { title: ILike(`%${search}%`) },
                order: { createdAt: sort === Sort.oldest ? "DESC" : "ASC" },
                skip: offset,
                take: pageSize,
                relations: { user: true },
            }
        );
    }

    getVotes(): number{
        // TODO: implement
        return 69;
    }

}
