import { createContext, type FC } from 'react';
import { Box, ChakraProvider, Heading, Text } from '@chakra-ui/react';
import Parent from './components/Parent';
import CtxProvider from './contexts/CtxProvider';
import { type CtxType } from './contexts/CtxProvider';

// contextの定義は大元のコンポーネントでやって、Providerを返すコンポーネントで使う
export const MenuCtx = createContext<CtxType | null>(null);

const Providers: FC = () => {
  return (
    <ChakraProvider>
      <CtxProvider>
        <>
          <Box>
            <Heading>メニューだよ</Heading>
            <Text>わ〜い</Text>
            <Parent />
          </Box>
        </>
      </CtxProvider>
    </ChakraProvider>
  );
};

export default Providers;
