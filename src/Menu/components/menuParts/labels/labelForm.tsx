import {
  type CSSProperties,
  type FC,
  type ChangeEvent,
  useContext,
} from 'react';
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
  type SubmitHandler,
  // type SubmitHandler,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import { MenuCtx, SetMenuCtx } from '@/Menu/App';
import LabelColor from './color';
import { type LabelData } from './labels';
import { setLabelDataAPI } from '@/Menu/API/configDataAPI';
import Full from '@/Menu/components/loader';

const LabelForm: FC = () => {
  const methods = useFormContext<LabelData>();
  const setMenuCtx = useContext(SetMenuCtx);
  const menuCtx = useContext(MenuCtx);

  // TODO: error handling
  if (menuCtx === null) throw new Error('non-context error');

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

  const onSubmit: SubmitHandler<LabelData> = async (data) => {
    await setLabelDataAPI(data)
      .then((res) => {
        console.log('done!');
        console.log(res);
        // TODO: ほんとは引数のLabelDataではなくレスポンスデータにデータを含ませてそれをここで設定値に使うべきだと思う
        setMenuCtx({
          userID: menuCtx?.userID,
          sheetName: menuCtx?.sheetName,
          labels: {
            labels: data.labels.map((m) => m.value),
            colors: data.labels.map((m) => m.color),
          },
        });
      })
      .catch((err: unknown) => {
        const e = err as Error;
        toast.error(
          `ラベルデータの編集に失敗しました！\n${e.name}\n${e.message}`,
          { duration: 8000 }
        );
      });
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
                          {...methods.register(`labels.${idx}.value`, {
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              methods.setValue(
                                `labels.${idx}.value`,
                                e.target.value
                              );
                            },
                          })}
                        />
                      </GridItem>
                      <GridItem colSpan={1}>
                        <LabelColor
                          popover={popover}
                          cover={cover}
                          curColor={field.color}
                          idx={idx}
                          {...methods.register(`labels.${idx}.color`)}
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
