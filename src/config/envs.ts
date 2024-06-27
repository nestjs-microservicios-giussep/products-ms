import 'dotenv/config';
import * as joi from 'joi';

const schema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error ${error.message}`);
}

export const envs = {
  port: value.PORT,
  databaseUrl: value.DATABASE_URL,
};
