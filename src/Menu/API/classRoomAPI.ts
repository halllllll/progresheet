import { errorMapper } from '../errors';
import { type ClassRoom } from '../types';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const getClassRoomInfoAPI = async (): Promise<ClassRoom> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getClassRoomConfig();
    if (ret.success) {
      return ret.body;
    } else {
      const err = errorMapper(ret.error)
      throw err
      // // TODO: error mapper
      // if (err instanceof PropertyError) {

      //   throw new PropertyError(ret.error.name + ' ' + ret.errorMsg);
      // } else {
      //   throw new UndefinedServerError(ret.error.name + ' ' + ret.errorMsg);
      // }
    }
  } else {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          {
            column: 3,
            row: 3,
          },
        );
      }, 1000);
    });
  }
};

export { getClassRoomInfoAPI };
