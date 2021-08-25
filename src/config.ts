import objectToQuery from "./helpers/objectToQuery";
import toCamelCase from "./helpers/toCamelCase";

export const environment = process.env.NODE_ENV;

export const logDirectory = process.env.LOG_DIR;

export const corsUrl = process.env.CORS_URL;

export const port: number | string = process.env.PORT || 8080;

export const jwtSecret = process.env.JWT_SECRET;

const dbOptions: { [optionKey: string]: string | undefined } = {}

Object.keys(process.env).forEach((key) => {
  if (key.match(/DB_OPTION/)) {
    // strip the option keyword from the env var key
    const strippedKey = key.slice(key.indexOf('DB_OPTION') + 'DB_OPTION_'.length);

    // convert env variable key to camel case before adding to object
    dbOptions[toCamelCase(strippedKey)] = process.env[key];
  }
})

export const dbConfig = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
  user: process.env.DB_USER || '',
  password: process.env.DB_USER_PWD || '',
  
  /**
   * Databse options.
   * Options are gotten from any env variable that starts with DB_OPTION_
   */
  options: objectToQuery(dbOptions),

  /**
   * If database connection uses DNS SRV. Eg When using MongoDB Atlas
   */
  dnsSrv: Boolean(process.env.DB_DNS_SRV)
}