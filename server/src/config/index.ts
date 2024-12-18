import dotenv from 'dotenv';
import { AppConfig } from '../types/config';

dotenv.config();

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
  database: {
    filePath: process.env.DB_FILE_PATH || './server/_mockDB/tasks.json',
    backupPath: process.env.DB_BACKUP_PATH || './server/_mockDB/backup/',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};