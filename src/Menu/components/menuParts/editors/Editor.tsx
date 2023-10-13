import { type FC } from 'react';
import { Heading, Box, Text, Stack } from '@chakra-ui/react';
import EditorsForm from './EditorsForm';

const Editor: FC = () => {
  return (
    <Box>
      <Heading variant="h2" size="lg">
        編集者設定
      </Heading>
      <Box py={5}>
        <Text my={2}>設定を編集できるアカウントを設定します。</Text>
        <Box
          p={5}
          borderColor={'tomato'}
          borderLeftWidth={'5px'}
          borderRightRadius={'10px'}
          backgroundColor={'orange.100'}
        >
          <Stack spacing={'10px'}>
            <Text as="b">
              {`SpreadSheetに「編集者として共有」しただけでは、設定シートを編集できません。`}
            </Text>
            <Text>{`（設定できない場合、このファイルのオーナーに連絡し、設定してもらってください。）`}</Text>
          </Stack>
        </Box>
      </Box>
      <EditorsForm />
    </Box>
  );
};

export default Editor;
