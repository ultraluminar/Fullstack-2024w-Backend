import { DataSource } from 'typeorm';
import { User } from './models/user/User.js';
import { Question } from './models/question/Question.js';
import { Answer } from './models/answer/Answer.js';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: true,
    entities: [User, Question, Answer],
    subscribers: [],
    migrations: [],
})
