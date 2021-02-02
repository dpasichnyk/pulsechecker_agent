import { hostname } from 'os';

export const ENV = process.env.NODE_ENV;

export const PORT = Number.parseInt(process.env.PORT || '3001', 10);
export const IS_PRODUCTION = ENV === 'production';
export const LOG_LEVEL = process.env.LOG_LEVEL || (IS_PRODUCTION ? 'warn' : 'debug');
export const HOST_NAME = process.env.HOST_NAME || hostname();
export const REDIS_URL = process.env.REDIS_URL || 'redis://redis.redis:6379/0';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'session_secret_designer_manicotti_affected';
