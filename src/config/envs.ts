import 'dotenv/config';

import * as Joi from 'joi';

interface Envs {
  PORT: number;
  HOST: string;
  DATABASE_PORT: number;
  POSTGRES_PASSWORD: string;
  POSTGRES_USER: string;
  POSTGRES_DB: string;
}

const envsSchema = Joi.object<Envs>({
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
}).unknown(true);

const validation = envsSchema.validate({
  ...process.env,
});

if (validation.error)
  throw new Error(`Config validation error: ${validation.error.message}`);

export const envs = validation.value;
