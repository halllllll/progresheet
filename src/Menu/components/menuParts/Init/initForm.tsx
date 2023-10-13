import { type FC } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import initAPI from '@/Menu/API/initAPI';
import Full from '@/Menu/components/loader';
import { InitError, UndefinedServerError } from '@/Menu/errors';

const InitForm: FC = () => {
  const methods = useFormContext();
  const onPost = async () => {
    await initAPI()
      .then((res) => {
        console.log(JSON.stringify(res));
        toast.success('初期化成功！');
      })
      .catch((err: unknown) => {
        // TODO: 下手くそ
        if (err instanceof InitError) {
          toast.error(
            `初期化エラーが発生したよ！\n${err.name}\n${err.message}`,
            {
              duration: 8000,
            }
          );
        }else if(err instanceof UndefinedServerError){
          toast.error(
            `未定義エラーが発生したよ！\n${err.name}\n${err.message}`,
            {
              duration: 8000,
            }
          );

        } else {
          const e = err as Error;
          toast.error(`謎のエラーが発生したよ！\n${e.name}\n${e.message}`, {
            duration: 8000,
          });
        }
      });
  };

  return (
    <>
      {methods.formState.isSubmitting && (
        <Full>
          <PropagateLoader
            color="#36d7b7"
            size={20}
            aria-label="Loading Spinner"
            loading={methods.formState.isSubmitting}
          />
        </Full>
      )}
      <form onSubmit={methods.handleSubmit(onPost)}>
        <Box>
          <Center>
            <Button
              mt="4"
              type="submit"
              disabled={
                !methods.formState.isValid || methods.formState.isSubmitting
              }
              isLoading={methods.formState.isSubmitting}
              loadingText="初期化中..."
              spinnerPlacement="start"
              colorScheme="red"
            >
              初期化する
            </Button>
          </Center>
        </Box>
      </form>
    </>
  );
};

export default InitForm;
