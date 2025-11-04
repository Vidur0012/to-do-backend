import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export enum ValidationSource {
  BODY = "body",
  HEADER = "headers",
  QUERY = "query",
  PARAM = "params"
};

export const schemaValidator = (validationSchema: Joi.Schema, validationSource:ValidationSource = ValidationSource.BODY) => {
  return async (req: Request, res: Response, next: NextFunction) => {
      try {
          await validationSchema.validateAsync(req[validationSource]);
          next();
      } catch (error: any) {
          return res.status(403).json({ message: error.message, data: null });
      }
  };
};