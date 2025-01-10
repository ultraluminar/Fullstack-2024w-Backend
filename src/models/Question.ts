import { IsDate, IsNotEmpty, MaxLength, MinLength, validate } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.js";

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
    user: User

    @CreateDateColumn()
    @IsDate()
    createdAt: Date

    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date

}
