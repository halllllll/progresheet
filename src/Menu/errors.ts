// TODO: これフロント用だな
export class InitError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'InitError';
  }
}
