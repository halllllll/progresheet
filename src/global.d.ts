/** Add functions to this object to expose them to Google Apps triggers. */

declare global {
  interface Google {
    script?: {
      run: any;
    };
  }

  const google: Google;
}

export {};
