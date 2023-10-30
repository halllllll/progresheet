import { type FC } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';

type Props = {
  name: string;
  onOpen: () => void;
  isOpen: boolean;
};
const ClassNameBtn: FC<Props> = ({ name, onOpen, isOpen }) => {
  return (
    <Box mb={4}>
      <HStack>
        <Text>{`座席表シート名: ${name}`}</Text>
        <Button onClick={onOpen} disabled={isOpen}>
          {'編集する'}
        </Button>
      </HStack>
    </Box>
  );
};

export default ClassNameBtn;
