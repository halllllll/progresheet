import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Box, Center, Heading, Text } from '@chakra-ui/react';
import { ClimbingBoxLoader } from 'react-spinners';
import { getLabelDataAPI } from '../API/configDataAPI';
import { getSpreadSheetInfoAPI, getAccessedUserInfoAPI } from '../API/userAndSheetAPI';
import { MenuCtx, SetMenuCtx } from '../App';
import { ConfigSheetError, UndefinedServerError } from '../errors';
import { type Editor, type Labels } from '../types';

type hasError =
  | {
      status: 'success';
    }
  | {
      status: 'failed';
      errMessage: string;
      error: Error;
    };

export type CtxType = {
  userID: string;
  sheetName: string;
  labels?: Labels;
  editors?: Editor[];
  // } & hasError;
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

      await Promise.all([getAccessedUserInfoAPI(), getSpreadSheetInfoAPI(), getLabelDataAPI()])
        .then(([userid, sheetname, labels]) =>{
          console.log('label!');
          setRes({
            userID: userid,
            sheetName: sheetname,
            labels
          });
        })
        .catch((err: unknown)=>{
          if(err instanceof ConfigSheetError){
            setIsError({
              status: 'failed',
              errMessage:
                '設定シートが不正です。確認してください（よくわからなければ初期化してください）',
              error: new ConfigSheetError(err.name + " " + err.message),
            });

          }else if(err instanceof UndefinedServerError){
            setIsError({
              status: 'failed',
              errMessage:
                'サーバーエラー',
              error: new UndefinedServerError(err.name + " " + err.message),
            });

          }else{
            const e = err as Error
            setIsError({
              status: 'failed',
              errMessage:
                '不明なエラー',
              error: new UndefinedServerError(e.name + " " + e.message),
            });

          }
        }).finally(()=>{
          setIsLoading(false);

        })
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
              <ClimbingBoxLoader color="#36d7b7" size="40" />
            </Center>
          </Box>
        ) : isError.status === 'failed' ? (
          <Box>
            <Heading>{`Error occured`}</Heading>
            <Text as="p">{isError.error.name ?? ''}</Text>
            <Text as="p">{isError.errMessage}</Text>
          </Box>
        ) : (
          children
        )}
      </MenuCtx.Provider>
    </SetMenuCtx.Provider>
  );
};

export default CtxProvider;
