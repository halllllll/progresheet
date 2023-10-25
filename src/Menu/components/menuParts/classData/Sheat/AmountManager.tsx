import {
  type FC,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
// import TestSheatsLaout from '../Test/TestSeatsLayoutDnd';
import { type UseFieldArrayReturn } from 'react-hook-form';
import { ClassDataCtx } from '../classData';
import AmountRoller from './AmountRoller';
import { ContextError } from '@/Menu/errors';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  append: UseFieldArrayReturn<ClassLayout>['append'];
  remove: UseFieldArrayReturn<ClassLayout>['remove'];
  fields: UseFieldArrayReturn<ClassLayout>['fields'];
  setColumnCount: Dispatch<SetStateAction<number>>;
};

const AmountManager: FC<Props> = ({
  append,
  remove,
  fields,
  setColumnCount,
}) => {
  const classDataCtx = useContext(ClassDataCtx);
  if (classDataCtx === null)
    throw new ContextError('non-context error', {
      details: 'on AmountManager',
    });

  // TODO: tostringとparseIntしているが大丈夫か？
  const [height, setHeight] = useState<number>(
    parseInt(classDataCtx.row.toString())
  );
  const [width, setWidth] = useState<number>(
    parseInt(classDataCtx.column.toString())
  );

  const handleFirst = (): void => {
    remove(Array.from({ length: fields.length }, (_, i) => i).slice(1));
  };
  const handleRemoveBy = (count: number): void => {
    remove(Array.from({ length: fields.length }, (_, i) => i).slice(-count));
  };

  const handleAddBy = (count: number): void => {
    append([
      ...Array.from({ length: count }, (_, i) => ({
        index: fields.length + i + 1,
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

          {/* <TestSheatsLaout height={height} width={width} /> */}
        </Stack>
      </Box>
    </Box>
  );
};

export default AmountManager;
