import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Box, Center, Code, Heading, Text } from '@chakra-ui/react';
import { ClimbingBoxLoader } from 'react-spinners';
import { getLabelDataAPI } from '../API/configDataAPI';
import {
  getSpreadSheetInfoAPI,
  getAccessedUserInfoAPI,
} from '../API/userAndSheetAPI';
import { MenuCtx, SetMenuCtx } from '../App';
import {
  ConfigError,
  SheetNotFoundError,
  UndefinedServerError,
} from '../errors';
import { type Editor, type Labels } from '../types';

type hasError =
  | {
      status: 'success';
    }
  | {
      status: 'failed';
      errName: string;
      errMessage: string;
    };

export type CtxType = {
  userID: string;
  sheetName: string;
  labels?: Labels;
  editors?: Editor[];
};

type Props = {
  children?: ReactNode;
};

const CtxProvider: FC<Props> = ({ children }) => {
  const [res, setRes] = useState<CtxType | null>(null);
  const [isError, setIsError] = useState<hasError>({ status: 'success' });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const f = async () => {
      // TODO: タイムアウト要検証
      // TODO: thenを使わない記法（catchは使う）

      await Promise.all([
        getAccessedUserInfoAPI(),
        getSpreadSheetInfoAPI(),
        getLabelDataAPI(),
      ])
        .then(([userid, sheetname, labels]) => {
          console.log('label!');
          setRes({
            userID: userid,
            sheetName: sheetname,
            labels,
          });
        })
        .catch((err: unknown) => {
          if (err instanceof ConfigError) {
            setIsError({
              status: 'failed',
              errName: err.name,
              errMessage: `${err.message}\n設定シートが不正です。確認してください（よくわからなければ初期化してください）`,
            });
          } else if (err instanceof UndefinedServerError) {
            setIsError({
              status: 'failed',
              errName: err.name,
              errMessage: err.message,
            });
          } else if (err instanceof SheetNotFoundError) {
            setIsError({
              status: 'failed',
              errName: err.name,
              errMessage: err.message,
            });
          } else {
            // TODO: まじめ
            const e = err as Error;
            setIsError({
              status: 'failed',
              errName: '不明なエラー',
              errMessage: `${e.name} \n ${e.message}`,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    setIsLoading(true);
    void f();
  }, []);

  return (
    <SetMenuCtx.Provider value={setRes}>
      <MenuCtx.Provider value={res}>
        {' '}
        {isLoading ? (
          // 全画面縦横中央ローディング(Fullで救えない)
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
              <ClimbingBoxLoader color="#36d7b7" size="40px" />
            </Center>
          </Box>
        ) : isError.status === 'failed' ? (
          <Box>
            <Heading>{`Error occured`}</Heading>
            <Text as="b" fontSize="18px" color={'tomato'}>
              {isError.errName}
            </Text>
            <Box>
              <Code>{isError.errMessage}</Code>
            </Box>
          </Box>
        ) : (
          children
        )}
      </MenuCtx.Provider>
    </SetMenuCtx.Provider>
  );
};

export default CtxProvider;
