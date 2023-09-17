import { type FC } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { PropagateLoader } from 'react-spinners';

const InitForm: FC = () => {
  const methods = useFormContext();
  const onPost = async () => {
    const ret = await new Promise((resolve) => {
      setTimeout(() => {
        resolve('a');
      }, 1000);
    });
    console.log(ret);
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
