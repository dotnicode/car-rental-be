import 'dotenv/config';

import * as Joi from 'joi';

interface Envs {
  PORT: number;
  HOST: string;
  DATABASE_PORT: number;
  POSTGRES_PASSWORD: string;
  POSTGRES_USER: string;
  POSTGRES_DB: string;
  AWS_ENDPOINT: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_BUCKET_NAME: string;
  AWS_COGNITO_USER_POOL_ID: string;
  AWS_COGNITO_CLIENT_ID: string;
  AWS_COGNITO_ENDPOINT: string;
  AWS_COGNITO_AUTHORITY: string;
}

const envsSchema = Joi.object<Envs>({
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_ENDPOINT: Joi.string().required(),
  AWS_COGNITO_USER_POOL_ID: Joi.string().required(),
  AWS_COGNITO_CLIENT_ID: Joi.string().required(),
  AWS_COGNITO_ENDPOINT: Joi.string().required(),
  AWS_COGNITO_AUTHORITY: Joi.string().required(),
}).unknown(true);

const validation = envsSchema.validate({
  ...process.env,
});

if (validation.error) throw new Error(`Config validation error: ${validation.error.message}`);

export const envs = validation.value;
