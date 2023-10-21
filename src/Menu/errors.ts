export type ErrorCode =
  | 'Init'
  | 'SheetNotFound'
  | 'SheetHeader'
  | 'Config'
  | 'Undefined'
  | 'Context'
  | 'Property'
  | 'Permission'
  | 'UpdateLabel'
  | 'UpdateProtection';

export type GASError = {
  code: ErrorCode;
  message: string;
};

interface ErrorOptions {
  cause?: Error;
  details?: unknown;
}

export const errorMapper = (gasError: GASError): Error => {
  switch (gasError.code) {
    case 'Config':
      return new ConfigError(gasError.message);
    case 'Context':
      return new ContextError(gasError.message);
    case 'Init':
      return new InitError(gasError.message);
    case 'Property':
      return new PropertyError(gasError.message);
    case 'Undefined':
      return new UndefinedServerError(gasError.message);
    case 'UpdateLabel':
      return new UpdateLabelError(gasError.message);
    case 'UpdateProtection':
      return new UpdateProtectionError(gasError.message);
    case 'Permission':
      return new PermissionError(gasError.message);
    case 'SheetNotFound':
      return new SheetNotFoundError(gasError.message);
    case 'SheetHeader':
      return new SheetHeaderError(gasError.message);

    default:
      return new Error('undefined code');
  }
};

// なぜかこれを継承すると`clasp push`でエラーになる
//  - `GaxiosError: Syntax error: ParseError: Unexpected token ; line: XX file: main.gs`
//
// class CustomError extends Error {
//   cause?: Error;
//   code?: string;
//   details?: unknown

//   constructor(message: string, options: ErrorOptions = {}){
//     super(message);
//     this.cause = options.cause;
//     this.code = options.code;
//     this.details = options.details
//   }
// }

export class InitError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InitError';
  }
}

export class ConfigError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ConfigError';
  }
}

export class UndefinedServerError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UndefinedError';
  }
}

export class PropertyError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PropertyError';
  }
}

export class ContextError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ContextError';
  }
}

export class UpdateLabelError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UpdateLabelError';
  }
}

export class UpdateProtectionError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UpdateProtectionError';
  }
}

export class PermissionError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PermissionError';
  }
}

export class SheetNotFoundError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'SheetNotFoundError';
  }
}

export class SheetHeaderError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'SheetHeaderError';
  }
}
