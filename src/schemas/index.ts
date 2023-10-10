import Joi from "joi";

export const agentSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
});

export const clientSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    document: Joi.string().required(),
});

export const userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})
