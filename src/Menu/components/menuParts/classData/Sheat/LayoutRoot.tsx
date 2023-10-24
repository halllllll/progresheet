import { type FC, useState } from 'react';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
// import TestSheatsLaout from '../Test/TestSeatsLayoutDnd';
import AmountRoller from './AmountRoller';
import { type ClassLayout } from '@/Menu/types';

/**
 *
 * NOTE!!!!!!
 *
 * this code is only for POC
 */

type Props = {
  classData: ClassLayout;
};
const LayoutRoot: FC<Props> = ({ classData }) => {
  // とりあえずここから手を付けるか 初期化後のデータを取得する想定
  // TODO: tostringとparseIntしているが大丈夫か？
  const [height, setHeight] = useState<number>(
    parseInt(classData.row.toString())
  );
  const [width, setWidth] = useState<number>(
    parseInt(classData.column.toString())
  );
  const heightHandler = (val: string) => {
    setHeight(parseInt(val));
  };
  const widthHandler = (val: string) => {
    setWidth(parseInt(val));
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
            {width} {height}
          </Text>
          {classData.seats.map((seat) => {
            return (
              <Box key={seat.index}>
                <Text>
                  {seat.index} {seat.name}
                </Text>
              </Box>
            );
          })}

          {/* <TestSheatsLaout height={height} width={width} /> */}
        </Stack>
      </Box>
    </Box>
  );
};

export default LayoutRoot;
