import {
  type FC,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import { type UseFieldArrayReturn } from 'react-hook-form';
import { MenuCtx } from '@/Menu/App';
import AmountRoller from './AmountRoller';
import { ContextError } from '@/Menu/errors';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  append: UseFieldArrayReturn<ClassLayout>['append'];
  remove: UseFieldArrayReturn<ClassLayout>['remove'];
  fieldLength: number;
  setColumnCount: Dispatch<SetStateAction<number>>;
};

const AmountManager: FC<Props> = ({
  append,
  remove,
  fieldLength,
  setColumnCount,
}) => {
  const menuCtx = useContext(MenuCtx);

  if (menuCtx === null)
    throw new ContextError('non-context error', { details: 'on EditorsForm' });

  // TODO: tostringとparseIntしているが大丈夫か？
  const [height, setHeight] = useState<number>(
    // parseInt(classDataCtx.row.toString())
    parseInt((menuCtx.classLayout?.row ?? 1).toString())
  );
  const [width, setWidth] = useState<number>(
    // parseInt(classDataCtx.column.toString())
    parseInt((menuCtx.classLayout?.column ?? 1).toString())
  );

  const handleFirst = (): void => {
    remove(Array.from({ length: fieldLength }, (_, i) => i).slice(1));
  };
  const handleRemoveBy = (count: number): void => {
    remove(Array.from({ length: fieldLength }, (_, i) => i).slice(-count));
  };

  const handleAddBy = (count: number): void => {
    append([
      ...Array.from({ length: count }, (_, i) => ({
        index: fieldLength + i + 1,
        name: '', // TODO: 名前は設定されてなくてもよいものとしたい（index_name）
        visible: true,
      })),
    ]);
  };

  const heightHandler = (val: string) => {
    const nextHeight = parseInt(val);
    if (width === 1 && nextHeight === 1) {
      handleFirst();
    } else {
      if (height < nextHeight) {
        handleAddBy(width * (nextHeight - height));
      } else if (nextHeight < height) {
        handleRemoveBy(width * (height - nextHeight));
      }
    }
    setHeight(nextHeight);
  };
  const widthHandler = (val: string) => {
    const nextWidth = parseInt(val);
    if (height === 1 && nextWidth === 1) {
      handleFirst();
    } else {
      if (width < nextWidth) {
        handleAddBy(height * (nextWidth - width));
      } else if (nextWidth < width) {
        handleRemoveBy(height * (width - nextWidth));
      }
    }
    setWidth(nextWidth);
    setColumnCount(nextWidth);
  };

  return (
    <Box>
      <Box>
        <Stack>
          <HStack gap={10}>
            <HStack>
              <AmountRoller
                defaultValue={height}
                label="Height"
                setValue={heightHandler}
              />
            </HStack>
            <HStack>
              <AmountRoller
                defaultValue={width}
                label="Width"
                setValue={widthHandler}
              />
            </HStack>
          </HStack>
          <Text>
            {/** TODO: あとでちゃんとやる */}
            H:{height} W: {width}
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default AmountManager;
