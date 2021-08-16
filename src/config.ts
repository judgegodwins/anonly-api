export const environment = process.env.NODE_ENV;

export const logDirectory = process.env.LOG_DIR;

export const corsUrl = process.env.CORS_URL;

export const port: number | string = process.env.PORT || 8080;

export const jwtSecret = process.env.JWT_SECRET;

export const dbConfig = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_USER_PWD || '',
}