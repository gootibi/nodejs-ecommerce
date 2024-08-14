import { NextFunction, Request, Response } from "express";
import { InternalException } from "./exceptions/internal-exception";
import { ErrorCode, HttpException } from "./exceptions/root";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch (error: any) {
            let exceptions: HttpException;
            if (error instanceof HttpException) {
                exceptions = error;
            } else {
                exceptions = new InternalException('Shomething went wrong!', error, ErrorCode.INTERNAL_EXCEPTION);
            }
            next(exceptions);
        }
    };
};