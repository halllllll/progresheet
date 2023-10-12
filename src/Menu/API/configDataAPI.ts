import {
  type SetLabelResponse,
  type LabelResponse,
} from '../AppsScript/service';
import { type LabelData } from '../components/menuParts/labels/labels';
import { ConfigSheetError, UndefinedError } from '../errors';
import { type Editor } from '../types';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const getLabelDataAPI = async (): Promise<LabelResponse> => {
  if (isGASEnvironment()) {
    try {
      const ret = await serverFunctions.getLabelConfig();
      if (!ret.success) {
        switch (ret.errorName) {
          case 'ConfigSheetError':
            throw new ConfigSheetError(ret.errorMsg);
          case 'UndefinedServerError':
            throw new UndefinedError(ret.errorMsg);
          default:
            throw new Error('undefied error');
        }
      }

      return ret;
    } catch (e: unknown) {
      if (e instanceof ConfigSheetError) {
        return {
          success: false,
          errorMsg: e.message,
          errorName: 'ConfigSheetError',
        };
      } else if (e instanceof UndefinedError) {
        return {
          success: false,
          errorMsg: e.message,
          errorName: 'UndefinedServerError',
        };
      } else {
        // TODO: more better...
        console.error(e);

        return {
          success: false,
          errorMsg: 'undefined error',
        };
      }
    }
  } else {
    return await new Promise<LabelResponse>((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          body: {
            labels: ['label1', 'label2'],
            colors: ['#d95858', '#88aafc'],
          },
        });
      }, 1000);
    });
  }
};

// JSON.stringifyにするため（ほかの方法不明）
export type LabelDataRequest = string;

const setLabelDataAPI = async (data: LabelData): Promise<SetLabelResponse> => {
  if (isGASEnvironment()) {
    console.table(data);
    const ret = await serverFunctions.setLabelConfig(JSON.stringify(data));
    if (ret.success) {
      return ret;
    } else {
      throw new ConfigSheetError(ret.error.name + ' ' + ret.errMsg);
    }
  } else {
    return await new Promise<SetLabelResponse>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }
};

const getConfigProtectionAPI = async (): Promise<Editor[]> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getConfigProtection();
    if (ret.success) {
      return ret.editors;
    } else {
      throw new ConfigSheetError(ret.error.name + ' ' + ret.error.message);
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

export { getLabelDataAPI, setLabelDataAPI, getConfigProtectionAPI };
