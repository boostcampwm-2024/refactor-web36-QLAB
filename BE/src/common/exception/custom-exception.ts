import { HttpException, HttpStatus } from '@nestjs/common';

export class DataLimitExceedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Too much data! Please reduce it and try again.',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class BadColumnQueryException extends HttpException {
  constructor(columnType: string) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message: `The column type '${columnType}' is not allowed.`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class RateLimitExceedException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many request right now! Please try again soon.',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
