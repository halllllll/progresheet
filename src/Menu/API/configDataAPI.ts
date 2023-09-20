import { type LabelResponse } from '../AppsScript/service';
import { type LabelData } from '../components/menuParts/labels/labels';
import { isGASEnvironment, serverFunctions } from './serverFunctions';

const getLabelDataAPI = async (): Promise<LabelResponse> => {
  if (isGASEnvironment()) {
    const ret = await serverFunctions.getLabelConfig();

    return ret;
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

export type LabelDataRequest = string;

// TODO: not boolean(only for test)
const setLabelDataAPI = async (data: LabelData): Promise<boolean> => {
  if (isGASEnvironment()) {
    console.log('go to endpoint... content here:');
    console.table(data);
    const ret = await serverFunctions.setLabelConfig(JSON.stringify(data));

    return ret;
  } else {
    return await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }
};

export { getLabelDataAPI, setLabelDataAPI };
