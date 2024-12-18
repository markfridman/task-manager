export interface DatabaseConfig {
  filePath: string;
  backupPath: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
  database: DatabaseConfig;
  jwt: JwtConfig;
}