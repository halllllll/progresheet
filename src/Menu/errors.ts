export type ErrorName =
  | 'InitError'
  | 'ConfigSheetError'
  | 'UndefinedServerError'
  | 'PropertyError';

interface ErrorOptions {
  cause?: unknown;
}

export class InitError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InitError';
  }
}

export class ConfigSheetError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ConfigSheetError';
  }
}

export class UndefinedError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UndefinedError';
  }
}
