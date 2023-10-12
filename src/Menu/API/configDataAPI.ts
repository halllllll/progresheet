import { type LabelData } from '../components/menuParts/labels/labels';
import { ConfigSheetError, PropertyError, UndefinedError } from '../errors';
import { type Labels, type Editor } from '../types';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const getLabelDataAPI = async (): Promise<Labels> => {
  if (isGASEnvironment()) {
      const ret = await serverFunctions.getLabelConfig();
      if (ret.success) {
        return ret.body;
      }else{
        const err = ret.error;
        if(err instanceof ConfigSheetError){
          throw new ConfigSheetError(err.name + " " + err.message)
        }else{
          throw new UndefinedError(err.name + " " + err.message)
        }

        // throw ret.error;
      }
  } else {
    return await new Promise<Labels>((resolve) => {
      setTimeout(() => {
        resolve({
            labels: ['label1', 'label2'],
            colors: ['#d95858', '#88aafc'],
          },
        );
      }, 1000);
    });
  }
};

// JSON.stringifyにするため（ほかの方法不明）
export type LabelDataRequest = string;

const setLabelDataAPI = async (data: LabelData): Promise<Labels> => {
  if (isGASEnvironment()) {
    console.table(data);
    const ret = await serverFunctions.setLabelConfig(JSON.stringify(data));
    if (ret.success) {
      return ret.body;
    } else {
      throw new ConfigSheetError(ret.error.name + ' ' + ret.errMsg);
      // throw ret.error;
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

const getConfigProtectionAPI = async (): Promise<Editor[]> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getConfigProtection();
    if (ret.success) {
      return ret.editors;
    } else {
      if(ret.error instanceof ConfigSheetError){
        throw new ConfigSheetError(ret.error.name + ' ' + ret.error.message);
    }else if(ret.error instanceof PropertyError){
      throw new PropertyError(ret.error.name + ' ' + ret.error.message);
    }else if(ret.error instanceof UndefinedError){
      throw new UndefinedError(ret.error.name + ' ' + ret.error.message);
    }else{
      throw new Error(ret.error.name + ' ' + ret.error.message);

    }
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
