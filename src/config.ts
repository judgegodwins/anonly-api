export enum AppEnvironmentEnum {
  TEST = "test",
  LOCAL = "local",
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

const config = {
  db: {
    uri: process.env.DB_URI!,
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

export const validateConfig = () => {
  const missingKeys: string[] = [];
  Object.entries(config).forEach(([baseKey, baseValue]) => {
    Object.entries(baseValue).forEach(([key, value]) => {
      if (value === "" || value === undefined) {
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

validateConfig();

export default config;
