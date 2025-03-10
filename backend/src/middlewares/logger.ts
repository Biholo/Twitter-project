import pino from 'pino';

const transport =
  process.env.NODE_ENV === 'development'
    ? pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname'
        }
      })
    : undefined;

export const logger = pino(transport);