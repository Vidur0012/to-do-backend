import Joi from 'joi';

// Validation schemas
export const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});