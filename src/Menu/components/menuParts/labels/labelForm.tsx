import { type FC } from 'react';
import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Input,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { PropagateLoader } from 'react-spinners';

const LabelForm: FC = () => {
  const methods = useFormContext();

  // FieldArrayとやらをやってみる

  const { fields, append, remove } = useFieldArray({
    name: 'values',
  });

  const onSubmit = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('push~');
        resolve('done');
      }, 1000);
    });
  };

  // type LabelList

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
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box>
          <Box py={4}>
            <VStack spacing={2}>
              {fields.map((field, idx) => {
                return (
                  <Stack key={field.id}>
                    <Grid templateColumns="repeat(5, 1fr)" gap={5}>
                      <GridItem colSpan={4}>
                        <Input placeholder={`hoa~~ ${idx}`} />
                      </GridItem>
                      <GridItem colSpan={1}>
                        <Button
                          type="button"
                          onClick={() => {
                            remove(idx);
                          }}
                        >
                          remove
                        </Button>
                      </GridItem>
                    </Grid>
                  </Stack>
                );
              })}
            </VStack>
          </Box>
          <Center>
            <Button
              type="button"
              onClick={() => {
                append({});
              }}
            >
              追加
            </Button>
          </Center>
          <Center>
            <Button
              mt="4"
              type="submit"
              disabled={
                !methods.formState.isValid || methods.formState.isSubmitting
              }
              isLoading={methods.formState.isSubmitting}
              loadingText="送信中..."
              spinnerPlacement="start"
              colorScheme="telegram"
            >
              送信する
            </Button>
          </Center>
        </Box>
      </form>
    </>
  );
};

export default LabelForm;
