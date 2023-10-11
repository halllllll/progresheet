import { type ClassRoomResponse } from '../AppsScript/service';
import { PropertyError, UndefinedError } from '../errors';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const getClassRoomInfoAPI = async (): Promise<ClassRoomResponse> => {
  if (isGASEnvironment()) {
    try {
      const ret = await serverFunctions.getClassRoomConfig();
      if (!ret.success) {
        switch (ret.errorName) {
          case 'PropertyError':
            throw new PropertyError(ret.errorMsg);
          default:
            throw new UndefinedError(ret.errorMsg);
        }
      }

      return ret;
    } catch (e: unknown) {
      if (e instanceof PropertyError) {
        return {
          success: false,
          errorMsg: e.message,
          errorName: 'PropertyError',
        };
      } else {
        return {
          success: false,
          errorMsg: 'no message',
          errorName: 'UndefinedServerError',
        };
      }
    }
  } else {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          errorMsg: '', // TODO
          errorName: 'PropertyError',
        });
      }, 1000);
    });
  }
};

export { getClassRoomInfoAPI };
