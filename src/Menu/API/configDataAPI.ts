import { type LabelResponse } from '../AppsScript/service';
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
            colors: ['#555555', '#88aafc'],
          },
        });
      }, 1000);
    });
  }
};

export { getLabelDataAPI };
