import { type FC } from 'react';
import { Box, Tag, Text } from '@chakra-ui/react';
import { type Seat } from '@/Menu/types';

const Cell: FC<Seat> = (props) => {
  const { index, name, visible } = props;

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
      <Text>{`index: ${index}`}</Text>
      <Text>{`name: ${name}`}</Text>
      <Tag>{`isvisible: ${visible ? 'TRUE' : 'FALSE'}`}</Tag>
    </Box>
  );
};

export default Cell;
