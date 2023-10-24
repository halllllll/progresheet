import { errorMapper } from '../errors';
import { type Seat, type ClassRoom } from '../types';
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
    return await new Promise<ClassRoom>((resolve) => {
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

const getClassRoomSeatAPI = async (): Promise<Seat[]> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getClassRoomSeat();
    if (ret.success) {
      return ret.body;
    } else {
      const err = errorMapper(ret.error);
      throw err;
    }
  } else {
    return await new Promise<Seat[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            index: 1,
            name: 'a',
            visible: false,
          },
          {
            index: 2,
            name: 'a',
            visible: false,
          },
          {
            index: 3,
            name: 'a',
            visible: false,
          },
          {
            index: 4,
            name: 'a',
            visible: false,
          },
          {
            index: 5,
            name: 'a',
            visible: false,
          },
          {
            index: 6,
            name: 'a',
            visible: false,
          },
          {
            index: 7,
            name: 'a',
            visible: false,
          },
          {
            index: 8,
            name: 'a',
            visible: false,
          },

          {
            index: 9,
            name: 'a',
            visible: false,
          },
        ]);
      }, 1000);
    });
  }
};

export { getClassRoomInfoAPI, getClassRoomSeatAPI };
