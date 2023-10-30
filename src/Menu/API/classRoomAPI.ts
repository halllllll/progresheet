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
          { index: 1, name: 'こんごうじ', visible: true },
          { index: 2, name: 'すずき', visible: false },
          { index: 3, name: 'たかはし', visible: true },
          { index: 4, name: 'Smith', visible: false },
          { index: 5, name: 'Johnson', visible: true },
          { index: 6, name: 'たなか', visible: false },
          { index: 7, name: 'Williams', visible: true },
          { index: 8, name: 'Oppenheimer', visible: false },
          { index: 9, name: 'Brown', visible: true },
        ]);
      }, 1000);
    });
  }
};

export { getClassRoomInfoAPI, getClassRoomSeatAPI };
