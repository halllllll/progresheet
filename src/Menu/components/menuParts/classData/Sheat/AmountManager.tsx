import { type FC, useState, useContext } from 'react';
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
};

const AmountManager: FC<Props> = ({ append, remove, fields }) => {
  // const setClassDataCtx = useContext(SetClassDataCtx);
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
        name: 'a',
        visible: true,
      })),
    ]);
  };

  const heightHandler = (val: string) => {
    // TODO: 増えたのなら増やすし、減ったのなら減らすようにする
    const nextHeight = parseInt(val);
    if (width === 1 && nextHeight === 1) {
      handleFirst();
      // setClassDataCtx({
      //   ...classDataCtx,
      //   seats: [...classDataCtx.seats.slice(0, 1)],
      // });
    } else {
      // あたらしく加えるSeatを生成して埋める必要がある...
      // heightが減ったのか増えたのか
      if (height < nextHeight) {
        handleAddBy(width * (nextHeight - height));
        // setClassDataCtx({
        //   ...classDataCtx,
        //   seats: [
        //     ...classDataCtx.seats,
        //     ...Array.from({ length: width }, (_, i) => ({
        //       index: classDataCtx.seats.length + i + 1,
        //       name: 'a',
        //       visible: true,
        //     })),
        //   ], // width分 後ろに追加
        // });
      } else if (nextHeight < height) {
        handleRemoveBy(width * (height - nextHeight));
        // setClassDataCtx({
        //   ...classDataCtx,
        //   seats: [...classDataCtx.seats.slice(0, -width)], // width分 後ろから削除
        // });
      }
    }
    setHeight(nextHeight);
  };
  const widthHandler = (val: string) => {
    const nextWidth = parseInt(val);
    if (height === 1 && nextWidth === 1) {
      handleFirst();
      // setClassDataCtx({
      //   ...classDataCtx,
      //   seats: [...classDataCtx.seats.slice(0, 1)],
      // });
    } else {
      if (width < nextWidth) {
        handleAddBy(height * (nextWidth - width));
        // 増えたとき
        // setClassDataCtx({
        //   ...classDataCtx,
        //   seats: [
        //     ...classDataCtx.seats,
        //     ...Array.from({ length: height }, (_, i) => ({
        //       index: classDataCtx.seats.length + i + 1,
        //       name: 'a',
        //       visible: true,
        //     })),
        //   ], // width分 後ろに追加
        // });
      } else if (nextWidth < width) {
        handleRemoveBy(height * (width - nextWidth));
        // 減ったとき
        // setClassDataCtx({
        //   ...classDataCtx,
        //   seats: [...classDataCtx.seats.slice(0, -height)], // width分 後ろから削除
        // });
      }
    }
    setWidth(nextWidth);
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
            W: {width} H:{height}
          </Text>

          {/* <TestSheatsLaout height={height} width={width} /> */}
        </Stack>
      </Box>
    </Box>
  );
};

export default AmountManager;
