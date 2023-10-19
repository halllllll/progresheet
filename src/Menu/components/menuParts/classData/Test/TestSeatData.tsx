import { type FC } from 'react';
import { Box, Tag, Text } from '@chakra-ui/react';
import { type SeatData } from './TestSeatsLayoutDnd';

const Seat: FC<SeatData> = (props) => {
  const { id, index, isVisible } = props;

  return (
    <Box
      border={'1px'}
      borderRadius={'md'}
      p={2}
      m={4}
      w={'100px'}
      h={'100px'}
      overflow={'scroll'}
    >
      <Text>{`id: ${id}`}</Text>
      <Text>{`index: ${index}`}</Text>
      <Tag>{`isvisible: ${isVisible ? 'TRUE' : 'FALSE'}`}</Tag>
    </Box>
  );
};

export default Seat;
