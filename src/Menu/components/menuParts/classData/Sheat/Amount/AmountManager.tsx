import { type FC, useState, type Dispatch, type SetStateAction } from 'react';
import { Box, HStack, Stack } from '@chakra-ui/react';
import AmountRoller from './AmountRoller';
import { useAppMenuCtx } from '@/Menu/contexts/hook';
import { ContextError } from '@/Menu/errors';
import { type ClassLayout, type Seat } from '@/Menu/types';

type Props = {
  fieldLength: number;
  append: (seats: Seat | Seat[]) => void;
  remove: (id: string | string[] | number) => void;
  setColumnCount: Dispatch<SetStateAction<number>>;
  menuClassLayoutCtxUpdater: (data: Partial<ClassLayout>) => void;
};

const AmountManager: FC<Props> = ({
  fieldLength,
  append,
  remove,
  setColumnCount,
  menuClassLayoutCtxUpdater,
}) => {
  const { menuCtx } = useAppMenuCtx('on AmountManager');
  if (!menuCtx.classLayout)
    throw new ContextError('non-context error', { details: 'on EditorsForm' });

  const [height, setHeight] = useState<number>(
    parseInt(menuCtx.classLayout.row.toString())
  );
  const [width, setWidth] = useState<number>(
    parseInt(menuCtx.classLayout.column.toString())
  );

  const handleFirst = (): void => {
    remove(fieldLength - 1);
  };
  const handleRemoveBy = (count: number): void => {
    remove(count);
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
    menuClassLayoutCtxUpdater({
      row: nextHeight,
    });
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
    menuClassLayoutCtxUpdater({
      column: nextWidth,
    });
  };

  return (
    <Box mb={6}>
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
      </Stack>
    </Box>
  );
};

export default AmountManager;
