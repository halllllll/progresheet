import { type LabelData } from '../components/menuParts/labels/labels';
import { errorMapper } from '../errors';
import { type Labels, type Editor } from '../types';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

/**
 * get label data from Apps Script
 * (when Local Server, return pseudo data)
 * @returns {Promise<void>}
 */
const getLabelDataAPI = async (): Promise<Labels> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getLabelConfig();
    if (ret.success) {
      return ret.body;
    } else {
      const err = errorMapper(ret.error);

      throw err;
    }
  } else {
    return await new Promise<Labels>((resolve) => {
      setTimeout(() => {
        resolve({
          labels: ['label1', 'label2'],
          colors: ['#d95858', '#88aafc'],
        });
      }, 1000);
    });
  }
};

/** JSON.stringifyにするため（ほかの方法不明） */
// export type LabelDataRequest = string;
/**
 * send new label data to Apps Script
 * (when Local Server, return pseudo data)
 * @param {LabelData} data
 * @returns {Promise<Labels>}
 */
const setLabelDataAPI = async (data: LabelData): Promise<Labels> => {
  if (isGASEnvironment()) {
    console.table(data);
    const ret = await serverFunctions.setLabelConfig(JSON.stringify(data));
    if (ret.success) {
      return ret.body;
    } else {
      const err = errorMapper(ret.error);
      throw err;
    }
  } else {
    return await new Promise<Labels>((resolve) => {
      setTimeout(() => {
        resolve({
          labels: ['label1', 'label2', 'labelX'],
          colors: ['#d95858', '#88aafc', '#b87a69'],
        });
      }, 1000);
    });
  }
};

/**
 * get Config Sheet Protection data from Apps Script
 * (when Local Server, return pseudo data)
 * @returns {Promise<Editor[]>}
 */
const getConfigProtectionAPI = async (): Promise<Editor[]> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getConfigProtection();
    if (ret.success) {
      return ret.editors;
    } else {
      const err = errorMapper(ret.error);
      throw err;
    }
  } else {
    return await new Promise<Editor[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'aaa',
            editable: false,
          },
          { id: 'bbb', editable: true },
          { id: 'xxx', editable: true },
          { id: 'ppp', editable: false },
        ]);
      }, 1400);
    });
  }
};

/**
 * update Config Sheet Protection data from Apps Script
 * and return new protected conditions.
 * (when Local Server, return pseudo data)
 * @param {Editor[]} data
 * @returns {Editor[]}
 */
const setConfigProtectionAPI = async (data: Editor[]): Promise<Editor[]> => {
  if (isGASEnvironment()) {
    console.table(data);
    const ret = await serverFunctions.setConfigProtection(JSON.stringify(data));
    if (ret.success) {
      return ret.editors;
    } else {
      const err = errorMapper(ret.error);
      throw err;
    }
  } else {
    return await new Promise<Editor[]>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1500);
    });
  }
};

export {
  getLabelDataAPI,
  setLabelDataAPI,
  getConfigProtectionAPI,
  setConfigProtectionAPI,
};
