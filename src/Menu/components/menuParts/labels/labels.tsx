import { type FC } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import LabelForm from './labelForm';

// ひとまず全部今のやつを取得してみよう
const Labels: FC = () => {
  const methods = useForm({
    mode: 'all',
    criteriaMode: 'all',
    shouldUnregister: false,
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
