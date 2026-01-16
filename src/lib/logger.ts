// Production-safe logger that avoids exposing sensitive data

const isDev = import.meta.env.DEV;

export const logger = {
  error: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.error(message, context);
    }
    // In production, we could send to a monitoring service
    // but never log sensitive data to console
  },
  
  warn: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.warn(message, context);
    }
  },
  
  info: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.info(message, context);
    }
  },
  
  debug: (message: string, context?: Record<string, unknown>) => {
    if (isDev) {
      console.log(message, context);
    }
  }
};
