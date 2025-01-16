import { DataSource } from 'typeorm';
import { User } from './models/user/User.js';
import { Question } from './models/question/Question.js';
import { Answer } from './models/answer/Answer.js';
import { MongoDBUser } from './models/user/MongoDBUser.js';

export const postgresDataSource = new DataSource({
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

export const mongoDBDataSource = new DataSource({
    type: "mongodb",
    host: process.env.MONGODB_HOST,
    port: Number(process.env.MONGODB_PORT),
    username: process.env.MONGO_INITDB_ROOT_USERNAME,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD,
    database: process.env.MONGODB_DB,
    authSource: "admin",
    synchronize: true,
    logging: true,
    entities: [MongoDBUser],
    useUnifiedTopology: true,
    subscribers: [],
    migrations: [],
})
