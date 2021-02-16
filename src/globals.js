import { hostname } from 'os';

export const ENV = process.env.NODE_ENV;

export const PORT = Number.parseInt(process.env.PORT || '3001', 10);
export const IS_PRODUCTION = ENV === 'production';
export const LOG_LEVEL = process.env.LOG_LEVEL || (IS_PRODUCTION ? 'warn' : 'debug');
export const HOST_NAME = process.env.HOST_NAME || hostname();
export const REDIS_HOST = process.env.REDIS_HOST || 'redis';
export const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_HOST}:6379/0`;
export const SESSION_SECRET = process.env.SESSION_SECRET || 'session_secret_designer_manicotti_affected';
export const METRIC_URL = process.env.METRICS_URL || 'https://metrics.pulsechecker.net:9200';
export const METRIC_USERNAME = process.env.METRICS_USERNAME || 'admin';
export const METRIC_PASSWORD = process.env.METRICS_USERNAME || 'admin';
export const QUEUE_NAME = process.env.QUEUE_NAME || 'pulsechecker';
