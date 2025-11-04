 import { Router } from "express";
import { signup, signin} from "../controllers/user.controller";
import { schemaValidator } from "../utils/validator";
import { signinSchema, signupSchema } from "../validationSchemas/user.validationSchema";

export const userRouter = Router();

userRouter.post("/signup",schemaValidator(signupSchema), signup);
userRouter.post("/signin", schemaValidator(signinSchema), signin);