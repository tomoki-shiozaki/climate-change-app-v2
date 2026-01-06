const isDev = process.env.NODE_ENV === "development";
const isStaging = process.env.NEXT_PUBLIC_STAGE === "staging";

const logWarn = (...args: unknown[]) => {
  if (isDev || isStaging) {
    console.warn(...args);
  }
};

const logInfo = (...args: unknown[]) => {
  if (isDev || isStaging) {
    console.info(...args);
  }
};

const logError = (...args: unknown[]) => {
  if (isDev || isStaging) {
    console.error(...args);
  }
};

export { logWarn, logInfo, logError };
