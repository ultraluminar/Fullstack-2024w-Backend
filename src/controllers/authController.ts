import { Request, Response } from "express";
import { validate } from "class-validator";
import { User } from "../models/user/User.js";
import { LoginUser } from '../models/user/LoginUser.js';
import { CreateUser } from '../models/user/CreateUser.js';
import { LoginResponse } from "../models/user/LoginResponse.js";
import { ErrorResponse } from "../models/ErrorResponse.js";
import { Token } from "../models/Token.js";

function validatePassword(password: string): boolean {
    return password.length >= 8;
}

export const authController = {
    async login(request: Request, response: Response) {
        const loginUser = LoginUser.fromRequest(request);
        if (loginUser == null) {
            const errorResponse = ErrorResponse.badParameters();
            response.status(400).json(errorResponse);
            return;
        }
        const user = await User.findOneBy({username: loginUser.username});
        if (user == null) {
            const errorResponse = ErrorResponse.invalidCredentials();
            response.status(401).json(errorResponse);
            return;
        }
        if (!await user.authenticate(loginUser.password)) {
            const errorResponse = ErrorResponse.invalidCredentials();
            response.status(401).json(errorResponse);
            return;
        }
        const tokenString = Token.generateFromUser(user);
        const loginResponse = new LoginResponse(tokenString);
        response.status(200).json(loginResponse);
    },

    async register(request: Request, response: Response) {
        console.log(request.body);
        const createUser = CreateUser.fromRequest(request);
        if (createUser == null) {
            const errorResponse = ErrorResponse.badParameters();
            response.status(400).json(errorResponse);
            return;
        }
        if (await User.existsBy({username: createUser.username})) {
            const errorResponse = ErrorResponse.usernameAlreadyTaken(createUser.username);
            response.status(409).json(errorResponse);
            return;
        }
        const user = await User.fromCreateUser(createUser);
        const errors = await validate(user);
        const isPasswordValid = validatePassword(createUser.password);
        if (errors.length > 0 || !isPasswordValid) {
            const errorResponse = ErrorResponse.fromValidationErrors(errors, isPasswordValid);
            response.status(400).json(errorResponse);
            return;
        }
        await user.save();
        const tokenString = Token.generateFromUser(user);
        const loginResponse = new LoginResponse(tokenString);
        response.status(201).json(loginResponse);
    }
}
