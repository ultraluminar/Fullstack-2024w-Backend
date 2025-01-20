import { Request, Response } from "express";
import { validate } from "class-validator";
import { User } from "../models/user/User.js";
import { LoginUser } from '../models/user/LoginUser.js';
import { CreateUser } from '../models/user/CreateUser.js';
import { LoginResponse, RegisterRespone } from "../models/user/LoginResponse.js";
import { MongoDBUser } from "../models/user/MongoDBUser.js";
import {
    BadParametersResponse,
    InvalidCredentialsResponse,
    UsernameAlreadyTakenResponse,
    ValidationErrorResponse,
} from "../models/ErrorResponse.js";

export const authController = {
    async login(request: Request, response: Response) {
        const loginUser = LoginUser.fromRequest(request);
        if (loginUser == null) {
            return BadParametersResponse.send(response);
        }
        const user = await User.findOneBy({ username: loginUser.username });
        if (user == null || !(await user.authenticate(loginUser.password))) {
            return InvalidCredentialsResponse.send(response);
        }
        const mongoDBUser = await MongoDBUser.findOrCreate(user.id);
        mongoDBUser.loginCouter += 1;
        await mongoDBUser.save();

        return LoginResponse.send(response, user);
    },

    async register(request: Request, response: Response) {
        console.log(request.body);
        const createUser = CreateUser.fromRequest(request);
        if (createUser == null) {
            return BadParametersResponse.send(response);
        }
        if (await User.existsBy({ username: createUser.username })) {
            return UsernameAlreadyTakenResponse.send(response, createUser.username);
        }
        const user = await User.fromCreateUser(createUser);
        const errors = await validate(createUser);
        if (errors.length > 0) {
            ValidationErrorResponse.send(response, errors);
        }
        await user.save();

        return RegisterRespone.send(response, user);
    },
};
