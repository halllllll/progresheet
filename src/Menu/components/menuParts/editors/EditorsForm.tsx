import { useState, type FC, useContext } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { SetMenuCtx, MenuCtx } from '@/Menu/App';
import { getConfigProtectionAPI } from '@/Menu/API/configDataAPI';
import { ConfigSheetError, ContextError } from '@/Menu/errors';
import { type Editor } from '@/Menu/types';

const EditorsForm: FC = () => {
  const setMenuCtx = useContext(SetMenuCtx);
  const menuCtx = useContext(MenuCtx);

  if (menuCtx === null) throw new ContextError('non-context error', {details: "on EditorsForm"});

  const [editors, setEditors] = useState<Editor[]>(menuCtx.editors ?? []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getEditors = async (): Promise<void> => {
    setIsLoading(true);
    await getConfigProtectionAPI()
      .then((res) => {
        setMenuCtx({
          editors: res,
          ...menuCtx
        })
        setEditors(res);
        toast.success("編集者を反映したよ！", {
          duration: 5000
        })
      })
      .catch((err: unknown) => {
        if (err instanceof ConfigSheetError) {
          toast.error(`設定シートのエラー！\n${err.name}\n${err.message}`);
        } else {
          const e = err as Error;
          toast.error(`謎のエラーが発生したよ！オーナー権限を確認してみてね！あなたには操作権限が無いかも？\n\n${e.name}\n${e.message}`, {
            duration: 8000,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box>
      <Button
        isLoading={isLoading}
        onClick={getEditors}
        isDisabled={isLoading}
      >
        取得する
      </Button>
      <Box>
        <Text>数：{editors.length}</Text>
        {editors.map((editor) => {
          return (
            <Box key={editor.id}>
              <HStack>
                <Text>{editor.id}</Text>
                <Text>{editor.editable ? "yes" : "NO"}</Text>
              </HStack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default EditorsForm;
