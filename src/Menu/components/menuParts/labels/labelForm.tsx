import { type FC } from 'react';
import { Box, Center } from '@chakra-ui/react';
import {
  useFormContext,
  useFieldArray,
  type SubmitHandler,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import AddButton from './Parts/AddButton';
import LabelArea from './Parts/LabelArea';
import SendButton from './Parts/SendButton';
import { type LabelData } from './labels';
import { setLabelDataAPI } from '@/Menu/API/configDataAPI';
import Full from '@/Menu/components/loader';
import { useAppMenuCtx } from '@/Menu/contexts/hook';

const LabelForm: FC = () => {
  const methods = useFormContext<LabelData>();
  const { menuCtx, setMenuCtx } = useAppMenuCtx();

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
          ...menuCtx,
          labels: res,
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
