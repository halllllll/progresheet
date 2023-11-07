import { type FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAppMenuCtx } from '@/Menu/contexts/hook';

const Top: FC = () => {
  const { menuCtx } = useAppMenuCtx('on Top');

  return (
    <Box>
      <Box my={5}>
        <Text>こんにちは、 {menuCtx.userID} さん。</Text>
        <Text>sheetname: {menuCtx.sheetName} !!!!!</Text>
      </Box>
    </Box>
  );
};

export default Top;
