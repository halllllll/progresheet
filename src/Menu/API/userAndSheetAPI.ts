import { serverFunctions, isGASEnvironment } from './serverFunctions';

const getAccessedUserInfoAPI = async (): Promise<string> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getUserInfo();

    return ret;
  } else {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve('dummy id');
      }, 1200);
    });
  }
};

const getSpreadSheetInfoAPI = async (): Promise<string> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getSpreadSheetName();

    return ret;
  } else {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve('pseudo sheet name');
      }, 300);
    });
  }
};

export { getAccessedUserInfoAPI, getSpreadSheetInfoAPI };
