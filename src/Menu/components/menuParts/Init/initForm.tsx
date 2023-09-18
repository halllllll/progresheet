import { type FC } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import initAPI from '@/Menu/API/initAPI';
import { InitError } from '@/Menu/errors';

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
          toast.error(`エラーが発生したよ！\n${err.name}\n${err.message}`);
        } else {
          const e = err as Error;
          toast.error(`エラーが発生したよ！\n${e.name}`);
        }
      });
  };

  return (
    <>
      {methods.formState.isSubmitting && (
        <Box
          position="fixed"
          zIndex="1000"
          left="0"
          top="0"
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.1)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <PropagateLoader
            color="#36d7b7"
            size={20}
            aria-label="Loading Spinner"
            loading={methods.formState.isSubmitting}
          />
        </Box>
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
