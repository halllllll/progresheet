import { type FC, useState, useContext } from 'react';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
// import TestSheatsLaout from '../Test/TestSeatsLayoutDnd';
import { ClassDataCtx, SetClassDataCtx } from '../classData';
import AmountRoller from './AmountRoller';
import { ContextError } from '@/Menu/errors';

const AmountManager: FC = () => {
  const setClassDataCtx = useContext(SetClassDataCtx);
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
  const heightHandler = (val: string) => {
    // TODO: 増えたのなら増やすし、減ったのなら減らすようにする
    const nextHeight = parseInt(val);
    if (width === 1 && nextHeight === 1) {
      setClassDataCtx({
        ...classDataCtx,
        seats: [...classDataCtx.seats.slice(0, 1)],
      });
    } else {
      // あたらしく加えるSeatを生成して埋める必要がある...
      // heightが減ったのか増えたのか
      if (height < nextHeight) {
        setClassDataCtx({
          ...classDataCtx,
          seats: [
            ...classDataCtx.seats,
            ...Array.from({ length: width }, (_, i) => ({
              index: classDataCtx.seats.length + i + 1,
              name: 'a',
              visible: true,
            })),
          ], // width分 後ろに追加
        });
      } else if (nextHeight < height) {
        setClassDataCtx({
          ...classDataCtx,
          seats: [...classDataCtx.seats.slice(0, -width)], // width分 後ろから削除
        });
      }
    }
    setHeight(nextHeight);
  };
  const widthHandler = (val: string) => {
    const nextWidth = parseInt(val);
    if (height === 1 && nextWidth === 1) {
      setClassDataCtx({
        ...classDataCtx,
        seats: [...classDataCtx.seats.slice(0, 1)],
      });
    } else {
      if (width < nextWidth) {
        // 増えたとき
        setClassDataCtx({
          ...classDataCtx,
          seats: [
            ...classDataCtx.seats,
            ...Array.from({ length: height }, (_, i) => ({
              index: classDataCtx.seats.length + i + 1,
              name: 'a',
              visible: true,
            })),
          ], // width分 後ろに追加
        });
      } else if (nextWidth < width) {
        // 減ったとき
        setClassDataCtx({
          ...classDataCtx,
          seats: [...classDataCtx.seats.slice(0, -height)], // width分 後ろから削除
        });
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
