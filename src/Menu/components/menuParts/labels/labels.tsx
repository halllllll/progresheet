import { useContext, type FC } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { MenuCtx } from '@/Menu/App';
import LabelForm from './labelForm';
import { LabelSchema } from './schema';

export type LabelData = {
  labels: Array<{
    value: string;
    color: string;
  }>;
};

const Labels: FC = () => {
  const ctx = useContext(MenuCtx);

  const defaultValues =
    ctx?.labels !== undefined && ctx.labels.colors.length > 0
      ? ctx.labels.colors.map((_, idx) => {
          return {
            value: ctx.labels?.labels[idx] ?? 'empty',
            color: ctx.labels?.colors[idx] ?? '#eeeeee',
          };
        })
      : [
          {
            value: 'empty',
            color: '#eeeeee',
          },
        ];

  const methods = useForm<LabelData>({
    mode: 'all',
    criteriaMode: 'all',
    shouldUnregister: false,
    defaultValues: {
      labels: defaultValues,
    },
    resolver: yupResolver(LabelSchema),
  });

  return (
    <Box>
      <Heading variant="h2" size="lg">
        ラベル設定
      </Heading>
      <Box py={5}>
        <Text>ラベルのテキストと背景色を設定します。</Text>
        <Text>
          （保存すると出席番号のシートに反映され、値はリセットされます）
        </Text>
        <FormProvider {...methods}>
          <LabelForm />
        </FormProvider>
      </Box>
    </Box>
  );
};

export default Labels;
