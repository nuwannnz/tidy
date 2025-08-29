import { LogContext, LogLevel } from './types.js';

class Logger {
  private _canLog = false;

  public set canLog(value: boolean) {
    this._canLog = value;
  }

  public get canLog(): boolean {
    return this._canLog;
  }

  public log(
    level: LogLevel,
    message: string,
    data: unknown = undefined,
    context = LogContext.General
  ): void {
    // TODO: implement centralized 3rd party logs
    if (level === LogLevel.Error) {
      console.error(
        `${context ? `[${context}] - ` : ''}${message}`,
        data ?? ''
      );
    } else if (level === LogLevel.Info) {
      console.info(`${context ? `[${context}] - ` : ''}${message}`, data ?? '');
    } else {
      console.warn(`${context ? `[${context}] - ` : ''}${message}`, data ?? '');
    }
  }
}

const logger = new Logger();
export default logger;
