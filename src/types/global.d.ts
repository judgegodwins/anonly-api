export {};

declare global {
  namespace NodeJS {
    interface Global {
      server: {
        isStartingUp: boolean;
        isShuttingDown: boolean;
      };
    }
  }
}
