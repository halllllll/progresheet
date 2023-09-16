import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { ClimbingBoxLoader } from 'react-spinners';
import { getSpreadSheetNameAPI, getUserIdAPI } from '../API/MenuDataAPI';
import { MenuCtx } from '../App';

export type CtxType = {
  userID: string;
  sheetName: string;
};

type Props = {
  children?: ReactNode;
};

const CtxProvider: FC<Props> = ({ children }) => {
  const [res, setRes] = useState<CtxType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: タイムアウト処理を実装したい
    const abortController = new AbortController();
    const f = async () => {
      const [userid, sheetname] = await Promise.all([
        getUserIdAPI(),
        getSpreadSheetNameAPI(),
        // TODO: タイムアウト要検証
        setTimeout(() => {
          abortController.abort();
        }, 1000),
      ]);

      setRes({ userID: userid, sheetName: sheetname });
      setIsLoading(false);
    };
    setIsLoading(true);
    void f();
  }, []);

  return (
    <MenuCtx.Provider value={res}>
      {' '}
      {isLoading ? (
        // 全画面縦横中央ローディング
        <Box
          left="0"
          top="0"
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.05)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Center h="full">
            <ClimbingBoxLoader color="#36d7b7" size="40" />
          </Center>
        </Box>
      ) : (
        children
      )}
    </MenuCtx.Provider>
  );
};

export default CtxProvider;
