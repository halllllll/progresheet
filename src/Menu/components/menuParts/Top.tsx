import { type FC, useContext } from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { MenuCtx } from '../../App';

const Top: FC = () => {
  const user = useContext(MenuCtx);

  return (
    <Box>
      <Box my={5}>
        <Text>こんにちわ {user?.userID} さん。</Text>
        <Text>sheetname: {user?.sheetName} !!!!!</Text>
      </Box>
      {user?.status === 'failed' && (
        <VStack spacing={4}>
          <HStack justify="center">
            <Text variant="h2" as="b" size="3xl" color="tomato">
              エラーを確認しました
            </Text>
          </HStack>
          <Box py={4}>
            <Text>{user.errMessage}</Text>
            <Text>{user.error.name}</Text>
            <Text>{user.error.message}</Text>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default Top;
