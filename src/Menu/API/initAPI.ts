import { type InitResponse } from '../AppsScript/service';
import { InitError } from '../errors';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const initAPI = async (): Promise<InitResponse> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.initConfig();
    if (ret.success) {
      return ret;
    } else {
      throw new InitError(ret.error.name + ' ' + ret.error.message);
    }
  } else {
    return await new Promise<InitResponse>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }
};

export default initAPI;
