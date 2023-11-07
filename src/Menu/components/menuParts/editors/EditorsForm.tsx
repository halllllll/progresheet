import { useState, type FC } from 'react';
import { Box, Button, Center, Skeleton } from '@chakra-ui/react';
import toast from 'react-hot-toast';

import EditorTable from './Table';
import {
  getConfigProtectionAPI,
  setConfigProtectionAPI,
} from '@/Menu/API/configDataAPI';
import { useAppMenuCtx } from '@/Menu/contexts/hook';
import { ConfigError } from '@/Menu/errors';
import { type Editor } from '@/Menu/types';

const EditorsForm: FC = () => {
  const { menuCtx, setMenuCtx } = useAppMenuCtx('on EditorsForm');

  const [editors, setEditors] = useState<Editor[]>(menuCtx.editors ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getEditors = async (): Promise<void> => {
    setIsLoading(true);
    await getConfigProtectionAPI('ラベル設定')
      .then((res) => {
        setMenuCtx({
          ...menuCtx,
          editors: res,
        });
        setEditors(res);
        toast.success('編集者情報を取得したよ！', {
          duration: 2000,
        });
      })
      .catch((err: unknown) => {
        if (err instanceof ConfigError) {
          toast.error(`設定シートのエラー！\n${err.name}\n${err.message}`);
        } else {
          const e = err as Error;
          toast.error(
            `謎のエラーが発生したよ！オーナー権限を確認してみてね！あなたには操作権限が無いかも？\n\n${e.name}\n${e.message}`,
            {
              duration: 8000,
            }
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const submitEditors = async (data: Editor[]) => {
    // promise.thenは使うなと言われたので...
    try {
      // TODO: いまのところsubmitはhook-formではなくただのButtonのonClickでやっているため心を込めてローディング状態を切り替えている
      setIsLoading(true);
      const res = await setConfigProtectionAPI(data);
      setMenuCtx({
        editors: res,
        ...menuCtx,
      });
      setEditors(res);
      console.warn(res);
      toast.success('編集者情報を更新したよ！', {
        duration: 2000,
      });
    } catch (err: unknown) {
      if (err instanceof ConfigError) {
        toast.error(`設定エラー！\n${err.name}\n${err.message}`);
      } else {
        const e = err as Error;
        toast.error(
          `謎のエラーが発生したよ！オーナー権限を確認してみてね！あなたには操作権限が無いかも？\n\n${e.name}\n${e.message}`,
          {
            duration: 8000,
          }
        );
      }
    } finally {
      setIsLoading(false);
      console.log('done');
    }
  };

  return (
    <Box>
      <Center>
        <Button
          isLoading={isLoading}
          onClick={getEditors}
          isDisabled={isLoading}
        >
          {editors.length === 0 ? `取得する` : `更新する`}
        </Button>
      </Center>
      <Box my={10}>
        <Skeleton height="50px" isLoaded={!isLoading} fadeDuration={1}>
          <>
            {/** TODO: かなりひどい冗長なコードになっているのでなんとかしたい。 追加や削除のないuseFormArrayを使えたらまだマシかも知れない */}
            {editors.length > 0 && (
              <EditorTable
                onSubmit={submitEditors}
                editors={editors}
                setEditors={setEditors}
                myId={menuCtx.userID}
                isLoading={isLoading}
              />
            )}
          </>
        </Skeleton>
      </Box>
    </Box>
  );
};

export default EditorsForm;
