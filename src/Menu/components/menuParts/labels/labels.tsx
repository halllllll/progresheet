import { type FC } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import LabelForm from './labelForm';
import { LabelSchema } from './schema';
import { useAppMenuCtx } from '@/Menu/contexts/hook';

export type LabelData = {
  labels: Array<{
    value: string;
    color: string;
  }>;
};

const Labels: FC = () => {
  const { menuCtx } = useAppMenuCtx('on Labels');

  const defaultValues =
    !!menuCtx.labels && menuCtx.labels.colors.length > 0
      ? menuCtx.labels.colors.map((_, idx) => {
          return {
            value: menuCtx.labels?.labels[idx] ?? 'empty',
            color: menuCtx.labels?.colors[idx] ?? '#eeeeee',
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
        <Text my={2}>ラベルのテキストと背景色を設定します。</Text>
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
