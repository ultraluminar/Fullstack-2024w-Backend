import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class MongoDBUser extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectId;

    @Column()
    userId: number;

    @Column()
    loginCouter: number = 0;

    @Column()
    questionsCreated: number = 0;

    @Column()
    questionsUpdated: number = 0;

    @Column()
    questionsDeleted: number = 0;

    @Column()
    answersCreated: number = 0;

    @Column()
    answersUpdated: number = 0;

    @Column()
    answersDeleted: number = 0;

    static async findOrCreate(userId: number): Promise<MongoDBUser> {
        const user = await MongoDBUser.findOneBy({ userId: userId });
        return user ?? MongoDBUser.create({ userId: userId });
    }
}
