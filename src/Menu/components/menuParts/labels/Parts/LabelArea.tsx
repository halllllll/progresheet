import { type CSSProperties, type ChangeEvent, type FC } from 'react';
import {
  VStack,
  Stack,
  Grid,
  GridItem,
  Input,
  FormErrorMessage,
  Button,
  Box,
} from '@chakra-ui/react';
import { useFormContext, type UseFieldArrayReturn } from 'react-hook-form';
import LabelColor from '../color';
import { type LabelData } from '../labels';

type LabelAreaProps = {
  fields: UseFieldArrayReturn<LabelData>['fields'];
  remove: UseFieldArrayReturn<LabelData>['remove'];
};

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

const LabelArea: FC<LabelAreaProps> = ({ fields, remove }) => {
  const methods = useFormContext<LabelData>();

  return (
    <Box py={4}>
      <VStack spacing={2}>
        {fields.map((field, idx) => {
          return (
            <Stack key={field.id}>
              <Grid templateColumns="repeat(8, 1fr)" gap={3}>
                <GridItem colSpan={5}>
                  <Input
                    placeholder={field.value}
                    required
                    {...methods.register(`labels.${idx}.value`, {
                      onChange: (e: ChangeEvent<HTMLInputElement>) => {
                        methods.setValue(`labels.${idx}.value`, e.target.value);
                      },
                    })}
                  />
                </GridItem>
                <FormErrorMessage>
                  {methods.formState.errors?.labels?.[idx]?.value?.message}
                </FormErrorMessage>

                <GridItem colSpan={1}>
                  <LabelColor
                    popover={popover}
                    cover={cover}
                    curColor={field.color}
                    idx={idx}
                    {...methods.register(`labels.${idx}.color`)}
                  />
                </GridItem>
                <FormErrorMessage>
                  {methods.formState.errors?.labels?.[idx]?.color?.message}
                </FormErrorMessage>
                <GridItem colSpan={2}>
                  <Button
                    type="button"
                    onClick={() => {
                      remove(idx);
                    }}
                    isDisabled={fields.length < 2}
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
  );
};

export default LabelArea;
