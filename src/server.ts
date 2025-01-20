import "reflect-metadata";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { postgresDataSource, mongoDBDataSource } from "./data-source.js";
import { usersRouter } from './routes/usersRouter.js';
import { questionsRouter } from "./routes/questionsRouter.js";
import { answersRouter } from "./routes/answersRouter.js";


await postgresDataSource.initialize();
console.log("postgresDataSource initialized successfully");

await mongoDBDataSource.initialize();
console.log("mongoDBDataSource initialized successfully");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);

const { BACKEND_PORT_INTERNAL, BACKEND_PORT } = process.env;

app.listen(BACKEND_PORT_INTERNAL, () => {
  console.log(`Server is listening on http://localhost:${BACKEND_PORT}`);
});
