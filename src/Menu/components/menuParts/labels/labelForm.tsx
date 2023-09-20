import { type CSSProperties, type FC } from 'react';
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
import {
  useFormContext,
  useFieldArray,
  // type SubmitHandler,
} from 'react-hook-form';
import { PropagateLoader } from 'react-spinners';
import LabelColor from './color';
import { type LabelData } from './labels';
import { setLabelDataAPI } from '@/Menu/API/configDataAPI';
import Full from '@/Menu/components/loader';

const LabelForm: FC = () => {
  const methods = useFormContext();

  // FieldArrayとやらをやってみる

  const { fields, append, remove } = useFieldArray<LabelData>({
    name: 'labels',
    shouldUnregister: false,
    rules: { minLength: 2 },
  });

  // ピッカーをポップアップするためのスタイル
  const popover: CSSProperties = {
    position: 'absolute',
    marginTop: '5px',
    zIndex: '2',
  };

  // ピッカー以外の領域を所をクリックした時に閉じるためのカバー
  const cover: CSSProperties = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };
  // TODO: typed, MUST AVOID any
  // const onSubmit: SubmitHandler<LabelData> = async (data) => {
  const onSubmit = async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const ret = await setLabelDataAPI(data);
    console.log('done!');
    console.log(ret);
  };

  // type LabelList

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
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box>
          <Box py={4}>
            <VStack spacing={2}>
              {fields.map((field, idx) => {
                return (
                  <Stack key={field.id}>
                    <Grid templateColumns="repeat(8, 1fr)" gap={3}>
                      <GridItem colSpan={5}>
                        <Input
                          placeholder={field.value}
                          name={`labels.value[${idx}]`}
                        />
                      </GridItem>
                      <GridItem colSpan={1}>
                        <LabelColor
                          popover={popover}
                          cover={cover}
                          curColor={field.color}
                        />
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Button
                          type="button"
                          onClick={() => {
                            remove(idx);
                          }}
                        >
                          削除
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
                append({
                  value: 'ラベルだよ！',
                  color: '#eeeeee',
                });
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
