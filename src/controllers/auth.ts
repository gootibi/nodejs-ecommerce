import { compareSync, hashSync } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";
import { JWT_SECRET } from "../secrets";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body);
    let { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
        next(new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXIST));
    }

    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10),
        }
    });

    res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
    let { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
        throw new Error();
    }

    if (!compareSync(password, user.password)) {
        throw new Error('Incorrect password!');
    }

    const token = jwt.sign({
        userId: user.id,
    }, JWT_SECRET);

    res.json({ user, token });
};