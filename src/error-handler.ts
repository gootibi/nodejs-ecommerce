import { NextFunction, Request, Response } from "express";
import { InternalException } from "./exceptions/internal-exception";
import { ErrorCode, HttpException } from "./exceptions/root";
import { ZodError } from "zod";
import { BadRequestsException } from "./exceptions/bad-requests";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch (error: any) {
            let exceptions: HttpException;
            if (error instanceof HttpException) {
                exceptions = error;
            } else {
                if (error instanceof ZodError) {
                    exceptions = new BadRequestsException('Unprocessable entity!', ErrorCode.UNPROCESSABE_ENTITY, error);
                } else {
                    exceptions = new InternalException('Shomething went wrong!', error, ErrorCode.INTERNAL_EXCEPTION);
                }
            }
            next(exceptions);
        }
    };
};