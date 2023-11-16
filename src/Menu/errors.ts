export type ErrorCode =
  | 'Init'
  | 'InvalidValue'
  | 'SheetNotFound'
  | 'SheetHeader'
  | 'Config'
  | 'Undefined'
  | 'Context'
  | 'PickSeat'
  | 'Property'
  | 'Permission'
  | 'UpdateLabel'
  | 'GenClass'
  | 'RunningApp'
  | 'UpdateProtection';

export type GASError = {
  code: ErrorCode;
  name?: string;
  message: string;
  options?: ErrorOptions;
};

interface ErrorOptions {
  cause?: Error;
  details?: unknown;
}

export const errorMapper = (gasError: GASError): Error => {
  switch (gasError.code) {
    case 'Config':
      return new ConfigError(gasError.message, gasError.options);
    case 'Context':
      return new ContextError(gasError.message, gasError.options);
    case 'Init':
      return new InitError(gasError.message, gasError.options);
    case 'Property':
      return new PropertyError(gasError.message, gasError.options);
    case 'Undefined':
      return new UndefinedServerError(gasError.message, gasError.options);
    case 'UpdateLabel':
      return new UpdateLabelError(gasError.message, gasError.options);
    case 'UpdateProtection':
      return new UpdateProtectionError(gasError.message, gasError.options);
    case 'Permission':
      return new PermissionError(gasError.message, gasError.options);
    case 'SheetNotFound':
      return new SheetNotFoundError(gasError.message, gasError.options);
    case 'SheetHeader':
      return new SheetHeaderError(gasError.message, gasError.options);
    case 'InvalidValue':
      return new InvalidValueError(gasError.message, gasError.options);
    case 'PickSeat':
      return new PickSeatError(gasError.message, gasError.options);
    case 'GenClass':
      return new GenClassError(gasError.message, gasError.options);
    case 'RunningApp':
      return new RunningAppError(gasError.message, gasError.options);
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

export class InvalidValueError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidValueError';
  }
}

export class PickSeatError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PickSeatError';
  }
}

export class GenClassError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'GenClass';
  }
}

export class RunningAppError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'RunningApp';
  }
}
