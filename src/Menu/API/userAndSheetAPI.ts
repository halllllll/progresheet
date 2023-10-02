import { serverFunctions, isGASEnvironment } from './serverFunctions';

const getUserIdAPI = async (): Promise<string> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getId();

    return ret;
  } else {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve('dummy id');
      }, 1200);
    });
  }
};

const getSpreadSheetNameAPI = async (): Promise<string> => {
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

export { getUserIdAPI, getSpreadSheetNameAPI };