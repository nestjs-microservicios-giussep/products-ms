import 'dotenv/config';
import * as joi from 'joi';

const schema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = schema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});
if (error) {
  throw new Error(`Config validation error ${error.message}`);
}

export const envs = {
  port: value.PORT,
  databaseUrl: value.DATABASE_URL,
  natsServers: value.NATS_SERVERS,
};
