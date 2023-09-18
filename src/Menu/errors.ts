interface ErrorOptions {
  cause?: unknown;
}

export class InitError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InitError';
  }
}

export class ConfigSheetError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ConfigSheetError';
  }
}
