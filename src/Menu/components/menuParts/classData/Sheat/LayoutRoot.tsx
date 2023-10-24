import { type FC, useState, useContext } from 'react';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
// import TestSheatsLaout from '../Test/TestSeatsLayoutDnd';
import { ClassDataCtx, SetClassDataCtx } from '../classData';
import AmountRoller from './AmountRoller';
import { ContextError } from '@/Menu/errors';

/**
 *
 * NOTE!!!!!!
 *
 * this code is only for POC
 */

const LayoutRoot: FC = () => {
  const _setClassDataCtx = useContext(SetClassDataCtx);
  const classDataCtx = useContext(ClassDataCtx);
  if (classDataCtx === null)
    throw new ContextError('non-context error', { details: 'on labelForm' });

  // TODO: tostringとparseIntしているが大丈夫か？
  const [height, setHeight] = useState<number>(
    parseInt(classDataCtx.row.toString())
  );
  const [width, setWidth] = useState<number>(
    parseInt(classDataCtx.column.toString())
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
            W: {width} H:{height}
          </Text>
          {classDataCtx.seats.map((seat) => {
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
