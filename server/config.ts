interface Config {
  databaseUrl: string;
  port: number;
  logLevel: string;
  fastifyLogging: boolean;
}

export const config: Config = {
  databaseUrl: process.env.DATABASE_URL,
  port: Number(process.env.PORT || 3000),
  logLevel: process.env.LOG_LEVEL || 'info',
  fastifyLogging: process.env.FASTIFY_LOGGING === 'true' || true
};
