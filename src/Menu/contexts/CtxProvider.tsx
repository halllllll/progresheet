import { useEffect, useState, type FC, type ReactNode } from 'react';
import { Box, Center } from '@chakra-ui/react';
import { ClimbingBoxLoader } from 'react-spinners';
import { getLabelDataAPI } from '../API/configDataAPI';
import { getSpreadSheetNameAPI, getUserIdAPI } from '../API/userAndSheetAPI';
import { MenuCtx } from '../App';
import { ConfigSheetError } from '../errors';
import { type Labels } from '../types';

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
} & hasError;

type Props = {
  children?: ReactNode;
};

const CtxProvider: FC<Props> = ({ children }) => {
  const [res, setRes] = useState<CtxType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const f = async () => {
      // TODO: タイムアウト要検証
      const [userid, sheetname, labelResp] = await Promise.all([
        getUserIdAPI(),
        getSpreadSheetNameAPI(),
        getLabelDataAPI(),
      ]);
      if (!labelResp.success) {
        if (labelResp.error instanceof ConfigSheetError) {
          setRes({
            userID: userid,
            sheetName: sheetname,
            status: 'failed',
            errMessage:
              '設定シートが不正です。確認してください（よくわからなければ初期化してください）',
            error: labelResp.error,
          });
        } else {
          setRes({
            userID: userid,
            sheetName: sheetname,
            status: 'failed',
            errMessage: `不明なエラー: ${
              labelResp.errorMsg ?? labelResp.error.message
            }`,
            error: labelResp.error,
          });
        }
      } else {
        console.log('label!');
        console.table(labelResp.body);
        setRes({
          userID: userid,
          sheetName: sheetname,
          labels: labelResp.body,
          status: 'success',
        });
      }
      setIsLoading(false);
    };
    setIsLoading(true);
    void f();
  }, []);

  return (
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
      ) : (
        children
      )}
    </MenuCtx.Provider>
  );
};

export default CtxProvider;
