import { EnvKeys } from '../types';

export abstract class AppEnv {
  public static getValue(key: EnvKeys): string {
    return process.env[key] ?? '';
  }
}
