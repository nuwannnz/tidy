import { APIGatewayProxyEvent } from 'aws-lambda';
import logger, { LogLevel } from '@tidy/utils/logger';
import { HttpError } from '../http/HttpError.js';
import { HttpStatus } from '../http/http.js';

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': 'true',
};

export interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export interface HandlerOptions<EventType> {
  successStatusCode?: HttpStatus;
  logContextBuilder?: (event: EventType) => Record<string, unknown>;
}

export type HandlerType<EventType, ReturnType> = (
  event: EventType
) => ReturnType;

export function handlerFn<ReturnType, EventType = APIGatewayProxyEvent>(
  func: HandlerType<EventType, ReturnType>,
  options: HandlerOptions<EventType> = {}
): (event: EventType) => Promise<HandlerResponse> {
  const { successStatusCode = HttpStatus.OK, logContextBuilder } = options;

  return async function (event: EventType): Promise<HandlerResponse> {
    const baseContext =
      typeof logContextBuilder === 'function' ? logContextBuilder(event) : {};
    try {
      logger.log(LogLevel.Info, 'handling', {
        ...baseContext,
      });

      const result = await func(event);

      logger.log(LogLevel.Info, 'returning result', {
        ...baseContext,
      });
      return {
        statusCode: successStatusCode,
        body: JSON.stringify(result),
        headers: { ...DEFAULT_HEADERS, 'Content-Type': 'application/json' },
      };
    } catch (unknownError) {
      // Normalize to HttpError
      let error: HttpError;
      if (unknownError instanceof HttpError) {
        error = unknownError;
      } else if (
        unknownError &&
        typeof unknownError === 'object' &&
        'message' in (unknownError as Record<string, unknown>)
      ) {
        error = new HttpError(
          String((unknownError as { message?: unknown }).message ?? 'Error'),
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      } else {
        error = new HttpError(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      logger.log(LogLevel.Error, 'caught and returning error', {
        ...baseContext,
        message: error.message,
        statusCode: error.statusCode,
      });

      return {
        statusCode: error.statusCode,
        body: JSON.stringify({ message: error.message }),
        headers: { ...DEFAULT_HEADERS, 'Content-Type': 'application/json' },
      };
    }
  };
}
