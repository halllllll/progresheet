
interface ErrorOptions {
  cause?: Error;
  code?: string;
  details?: unknown;
}

class CustomError extends Error {
  cause?: Error;
  code?: string;
  details?: unknown

  constructor(message: string, options: ErrorOptions = {}){
    super(message);
    this.cause = options.cause;
    this.code = options.code;
    this.details = options.details
  }
}

export class InitError extends CustomError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InitError';
  }
}

export class ConfigSheetError extends CustomError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ConfigSheetError';
  }
}

export class UndefinedError extends CustomError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UndefinedError';
  }
}

export class PropertyError extends CustomError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PropertyError';
  }
}
