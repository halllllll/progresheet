import { errorMapper } from '../errors';
import { type ClassRoom } from '../types';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const getClassRoomInfoAPI = async (): Promise<ClassRoom> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getClassRoomConfig();
    if (ret.success) {
      return ret.body;
    } else {
      const err = errorMapper(ret.error);
      throw err;
    }
  } else {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          column: 3,
          row: 3,
          name: 'dev class',
        });
      }, 1000);
    });
  }
};

export { getClassRoomInfoAPI };
