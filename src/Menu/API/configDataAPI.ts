import { type CONFIG_SHEET } from '@/Const/SheetEnv';
import { type LabelData } from '../components/menuParts/labels/labels';
import { errorMapper } from '../errors';
import { type Labels, type Editor, type EditorRequest } from '../types';
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
      return ret.data;
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

/**
 * send new label data to Apps Script
 * (when Local Server, return pseudo data)
 * LabelDataが入れ子要素に配列をもつので、入れ子になったオブジェクトは解釈できないため、JSON.stringifyにする（ほかの方法不明）
 * @param {LabelData} data
 * @returns {Promise<Labels>}
 */
const setLabelDataAPI = async (data: LabelData): Promise<Labels> => {
  if (isGASEnvironment()) {
    console.warn(JSON.stringify(data));
    const ret = await serverFunctions.setLabelConfig(JSON.stringify(data));
    if (ret.success) {
      return ret.data;
    } else {
      const err = errorMapper(ret.error);
      throw err;
    }
  } else {
    const ret = await new Promise<Labels>((resolve) => {
      setTimeout(() => {
        const ret = data.labels.reduce<Labels>(
          (prev, cur) => {
            return {
              labels: [...prev.labels, cur.value],
              colors: [...prev.colors, cur.color],
            };
          },
          { labels: [], colors: [] }
        );
        resolve(ret);
      }, 1000);
    });
    console.warn(ret);

    return ret;
  }
};

/**
 * get Config Sheet Protection data from Apps Script
 * (when Local Server, return pseudo data)
 * @returns {Promise<Editor[]>}
 */
const getConfigProtectionAPI = async (
  configSeat: CONFIG_SHEET
): Promise<Editor[]> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getConfigProtection(configSeat);
    if (ret.success) {
      return ret.data;
    } else {
      const err = errorMapper(ret.error);
      throw err;
    }
  } else {
    return await new Promise<Editor[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            useId: 'aaa',
            editable: false,
          },
          { useId: 'dummy id', editable: true },
          { useId: 'xxx', editable: true },
          { useId: 'ppp', editable: false },
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
    console.warn(data);
    const req: EditorRequest = {
      editors: [...data],
    };
    const ret = await serverFunctions.setAllConfigProtections(
      JSON.stringify(req)
    );
    if (ret.success) {
      return ret.data;
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
