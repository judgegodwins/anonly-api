import objectToQuery from "./helpers/objectToQuery";
import toCamelCase from "./helpers/toCamelCase";

const dbOptions: { [optionKey: string]: string | undefined } = {};

Object.keys(process.env).forEach((key) => {
  if (key.match(/DB_OPTION/)) {
    // strip the option keyword from the env var key
    const strippedKey = key.slice(
      key.indexOf("DB_OPTION") + "DB_OPTION_".length
    );

    // convert env variable key to camel case before adding to object
    dbOptions[toCamelCase(strippedKey)] = process.env[key];
  }
});

export enum AppEnvironmentEnum {
  TEST = "test",
  LOCAL = "local",
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

const config = {
  db: {
    name: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT!,
    user: process.env.DB_USER!,
    password: process.env.DB_USER_PWD!,
    dbUri: process.env.DB_URI,

    /**
     * Databse options.
     * Options are gotten from any env variable that starts with DB_OPTION_
     */
    options: objectToQuery(dbOptions),

    /**
     * If database connection uses DNS SRV. Eg When using MongoDB Atlas
     */
    dnsSrv: Boolean(process.env.DB_DNS_SRV!),
  },
  redis: {
    mode: process.env.REDIS_MODE! || "cluster",
    host: process.env.REDIS_HOST!,
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!,
  },
  env: {
    isProduction: process.env.NODE_ENV === AppEnvironmentEnum.PRODUCTION,
    isDevelopment: process.env.NODE_ENV === AppEnvironmentEnum.DEVELOPMENT,
    isTest: process.env.NODE_ENV === AppEnvironmentEnum.TEST,
  },
  app: {
    env: process.env.APP_ENV! as AppEnvironmentEnum,
    logDirectory: process.env.LOG_DIR,
    isProduction: process.env.APP_ENV === AppEnvironmentEnum.PRODUCTION,
    clientUrl: process.env.CLIENT_URL!,
    port: +process.env.PORT!,
    jwtSecret: process.env.JWT_SECRET!,
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
  },
};

export const validateConfig = (
  exceptions = ["db.dbUri", "db.options", "app.logDirectory", "app.corsUrl"]
) => {
  const missingKeys: string[] = [];
  Object.entries(config).forEach(([baseKey, baseValue]) => {
    Object.entries(baseValue).forEach(([key, value]) => {
      if (
        (value === "" || value === undefined) &&
        !exceptions.includes(`${baseKey}.${key}`)
      ) {
        missingKeys.push(`${baseKey}.${key}`);
      }
    });
  });
  if (missingKeys.length) {
    global.console.error(
      `The following configuration keys are not set: ${missingKeys.join(", ")}`
    );
    process.exit(1);
  }
};

export default config;
