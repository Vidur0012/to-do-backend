import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
    statusCode?: number;
    data?: string;
}

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
};