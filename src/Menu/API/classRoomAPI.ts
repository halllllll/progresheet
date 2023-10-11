import { type ClassRoomResponse } from '../AppsScript/service';
import { PropertyError, UndefinedError } from '../errors';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const getClassRoomInfoAPI = async (): Promise<ClassRoomResponse> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getClassRoomConfig();
    if (ret.success) {
      return ret;
    } else {
      const err = ret.error;
      if (err instanceof PropertyError) {
        throw new PropertyError(ret.error.name + ' ' + ret.errorMsg);
      } else {
        throw new UndefinedError(ret.error.name + ' ' + ret.errorMsg);
      }
    }
  } else {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          body: {
            column: 3,
            row: 3,
          },
        });
      }, 1000);
    });
  }
};

export { getClassRoomInfoAPI };
