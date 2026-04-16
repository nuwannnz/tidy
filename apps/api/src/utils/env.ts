export interface AppEnv {
  NODE_ENV: string;
  PORT: number;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_LAMBDA_FUNCTION_NAME: string | undefined;
  DYNAMODB_ENDPOINT: string | undefined;
  DYNAMODB_TABLE_NAME: string;
  JWT_SECRET: string;
}

function getEnvString(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function getEnvNumber(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

function getEnvOptional(key: string): string | undefined {
  return process.env[key];
}

export function loadEnv(): AppEnv {
  return {
    NODE_ENV: getEnvString('NODE_ENV', 'development'),
    PORT: getEnvNumber('PORT', 3001),
    AWS_REGION: getEnvString('AWS_REGION', 'us-east-1'),
    AWS_ACCESS_KEY_ID: getEnvString('AWS_ACCESS_KEY_ID', ''),
    AWS_SECRET_ACCESS_KEY: getEnvString('AWS_SECRET_ACCESS_KEY', ''),
    AWS_LAMBDA_FUNCTION_NAME: getEnvOptional('AWS_LAMBDA_FUNCTION_NAME'),
    DYNAMODB_ENDPOINT: getEnvOptional('DYNAMODB_ENDPOINT'),
    DYNAMODB_TABLE_NAME: getEnvString('DYNAMODB_TABLE_NAME', 'tidy'),
    JWT_SECRET: getEnvString('JWT_SECRET', ''),
  };
}

export const env = loadEnv();
