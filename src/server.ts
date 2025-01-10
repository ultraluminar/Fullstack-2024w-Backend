import "reflect-metadata";
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from "./data-source.js";
import { usersRouter } from './routes/usersRouter.js';
import { questionsRouter } from "./routes/questionsRouter.js";

await AppDataSource.initialize();
console.log("AppDataSource initialized successfully");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/questions', questionsRouter);

const { BACKEND_PORT_INTERNAL, BACKEND_PORT } = process.env;

app.listen(BACKEND_PORT_INTERNAL, () => {
  console.log(`Server is listening on http://localhost:${BACKEND_PORT}`);
});
