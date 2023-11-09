import { type GASError } from '../errors';

export type OperationResult<T> =
  | {
      success: false;
      error: GASError;
    }
  | {
      success: true;
      data: T;
    };
