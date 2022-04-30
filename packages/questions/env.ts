/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  PAGINATION_LIMIT: Env.schema.number(),
  DB_CONNECTION: Env.schema.string(),
  PG_HOST: Env.schema.string({ format: 'host' }),
  PG_PORT: Env.schema.number(),
  PG_USER: Env.schema.string(),
  PG_PASSWORD: Env.schema.string.optional(),
  PG_DB_NAME: Env.schema.string(),
  KEYCLOAK_CLIENT_ID: Env.schema.string(),
  KEYCLOAK_CLIENT_SECRET: Env.schema.string(),
  KEYCLOAK_AUTH_SERVER_URL: Env.schema.string(),
  KEYCLOAK_REALM: Env.schema.string(),
  KEYCLOAK_REALM_TOKEN_SIGNATURE_PUBLIC_KEY: Env.schema.string(),
  RABBITMQ_CONNECTION_USER: Env.schema.string(),
  RABBITMQ_CONNECTION_PASSWORD: Env.schema.string(),
  RABBITMQ_CONNECTION_HOST: Env.schema.string({ format: 'host' }),
  RABBITMQ_CONNECTION_PORT: Env.schema.number(),
  RABBITMQ_SUBSCRIPTIONS_EXCHANGE_NAME: Env.schema.string(),
  RABBITMQ_SUBSCRIPTIONS_REGISTRATION_QUEUE_NAME: Env.schema.string(),
  RABBITMQ_SUBSCRIPTIONS_REGISTRATION_BINDING_KEY: Env.schema.string(),
  RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_QUEUE_NAME: Env.schema.string(),
  RABBITMQ_SUBSCRIPTIONS_NEW_ANSWER_BINDING_KEY: Env.schema.string(),
})
