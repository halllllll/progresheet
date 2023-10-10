import { type FC, useState } from 'react';
import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import AmountRoller from './AmountRoller';

const LayoutRoot: FC = () => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
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
              <AmountRoller label="Height" setValue={heightHandler} />
            </HStack>
            <HStack>
              <AmountRoller label="Width" setValue={widthHandler} />
            </HStack>
          </HStack>
          <Text>{`width: ${width}`}</Text>
          <Text>{`height: ${height}`}</Text>
        </Stack>
      </Box>
    </Box>
  );
};

export default LayoutRoot;
