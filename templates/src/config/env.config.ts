const mainConfigs = {
  app: {
    port: Number(process.env.APP_PORT) || 8888,
    host: process.env.APP_HOST || 'localhost',
    protocol: process.env.APP_PROTOCOL || 'http',
    name: process.env.APP_NAME || 'app-service',
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
  },

  env: {
    name: process.env.NODE_ENV || 'development',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
} as const;

export default mainConfigs;
