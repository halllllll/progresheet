import { type FC } from 'react';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useAppMenuCtx } from '@/Menu/contexts/hook';
import { ContextError } from '@/Menu/errors';

type Props = {
  onOpen: () => void;
  isOpen: boolean;
};
const ClassNameBtn: FC<Props> = ({ onOpen, isOpen }) => {
  const { menuCtx } = useAppMenuCtx();

  if (menuCtx.classLayout === undefined)
    throw new ContextError('non-context error', { details: 'on SeatForm' });

  return (
    <Box mb={4}>
      <HStack>
        <Text>{`座席表シート名: ${menuCtx.classLayout.name}`}</Text>
        <Button onClick={onOpen} disabled={isOpen}>
          {'編集する'}
        </Button>
      </HStack>
    </Box>
  );
};

export default ClassNameBtn;
