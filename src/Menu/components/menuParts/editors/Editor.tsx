import { type FC } from 'react';
import { Heading, Box, Text } from '@chakra-ui/react';
import EditorsForm from './EditorsForm';

const Editor: FC = () => {
  return (
    <Box>
      <Heading variant="h2" size="lg">
        編集者設定
      </Heading>
      <Box py={5}>
        <Text>設定を編集できるアカウントを設定します。</Text>
        <Text color="tomato">{`（SpreadSheetに「編集者として共有」しただけでは編集できません）`}</Text>
      </Box>
      <EditorsForm />
    </Box>
  );
};

export default Editor;
