
interface ErrorOptions {
  cause?: Error;
  code?: string;
  details?: unknown;
}

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

export class PropertyError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'PropertyError';
  }
}

export class ContextError extends Error{
  constructor(message?: string, options?: ErrorOptions){
    super(message, options);
    this.name = "ContextError"
  }
}
