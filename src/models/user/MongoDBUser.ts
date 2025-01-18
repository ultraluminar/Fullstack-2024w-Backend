import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn, Repository } from "typeorm";

@Entity()
export class MongoDBUser extends BaseEntity {
    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    userId: number;

    @Column({ default: 0 })
    loginCouter: number;

    @Column({ default: 0 })
    questionsCreated: number;

    @Column({ default: 0 })
    questionsUpdated: number;

    @Column({ default: 0 })
    questionsDeleted: number;

    @Column({ default: 0 })
    answersCreated: number;

    @Column({ default: 0 })
    answersUpdated: number;

    @Column({ default: 0 })
    answersDeleted: number;

    static async findOrCreate(userId: number): Promise<MongoDBUser> {
        const user = await MongoDBUser.findOneBy({ userId: userId });
        return user ?? MongoDBUser.create({ userId: userId });
    }
}
