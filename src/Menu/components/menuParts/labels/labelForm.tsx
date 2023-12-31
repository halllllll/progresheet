import { type FC, useContext } from 'react';
import { Box, Center } from '@chakra-ui/react';
import {
  useFormContext,
  useFieldArray,
  type SubmitHandler,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { MenuCtx, SetMenuCtx } from '@/Menu/App';
import AddButton from './AddButton';
import LabelArea from './LabelArea';
import SendButton from './SendButton';
import { type LabelData } from './labels';
import { setLabelDataAPI } from '@/Menu/API/configDataAPI';
import Full from '@/Menu/components/loader';
import { ContextError } from '@/Menu/errors';

const LabelForm: FC = () => {
  const methods = useFormContext<LabelData>();
  const setMenuCtx = useContext(SetMenuCtx);
  const menuCtx = useContext(MenuCtx);

  if (menuCtx === null)
    throw new ContextError('non-context error', { details: 'on labelForm' });

  // FieldArrayとやらをやってみる

  const { fields, append, remove } = useFieldArray<LabelData>({
    name: 'labels',
    control: methods.control, // 不要？
    shouldUnregister: false,
    // なぜかルールが効かない
    rules: {
      minLength: {
        value: 2,
        message: '2つ以上必要です',
      },
      required: true,
      validate: (values) => {
        return values.length > 0;
      },
    },
  });

  const onSubmit: SubmitHandler<LabelData> = async (data) => {
    await setLabelDataAPI(data)
      .then((res) => {
        setMenuCtx({
          labels: res,
          ...menuCtx,
        });
        toast.success('ラベルデータをシートに反映しました！');
      })
      .catch((err: unknown) => {
        const e = err as Error;
        toast.error(
          `ラベルデータの更新・取得に失敗しました！\n${e.name}\n${e.message}`,
          { duration: 8000 }
        );
      });
  };

  return (
    <>
      {methods.formState.isSubmitting && (
        <Full>
          <PropagateLoader
            color="#36d7b7"
            size={20}
            aria-label="Loading Spinner"
            loading={methods.formState.isSubmitting}
          />
        </Full>
      )}
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box>
          <LabelArea remove={remove} fields={fields} />
          <Center>
            <AddButton append={append} text={'追加'} />
          </Center>
          <Center>
            <SendButton text="送信する" disabledCondition={fields.length < 2} />
          </Center>
        </Box>
      </form>
    </>
  );
};

export default LabelForm;
