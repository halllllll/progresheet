import { type FC } from 'react';
import { Avatar, Box, Stack, Text } from '@chakra-ui/react';
import { type SeatDTO } from '@/Menu/types';

const Cell: FC<SeatDTO> = (props) => {
  const { index, name, visible } = props;

  return (
    <Box
      border={'1px'}
      borderRadius={'md'}
      p={1}
      m={4}
      w={'100px'}
      h={'80px'}
      bg={visible ? 'blue.100' : ''}
    >
      <Stack overflow={'hidden'}>
        <Avatar
          name={`${index}`}
          getInitials={() => `${index}`}
          size={'md'}
          bg={visible ? 'teal.500' : 'blackAlpha.700'}
          boxSize={'8'}
        />
        <Box>
          {/** TODO: なぜかtrancateされない */}
          <Text as="b" isTruncated>{`${
            name?.trim() === '' || name === undefined ? `${index}` : name
          }`}</Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default Cell;
