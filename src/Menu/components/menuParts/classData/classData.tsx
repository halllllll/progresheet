import { type FC } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import LayoutRoot from './LayoutRoot';

const ClassData: FC = () => {
  const _methods = useFormContext();

  return (
    <Box>
      <Heading variant="h2" size="lg">
        クラス設定
      </Heading>
      <Box py={5}>
        <Text>クラス名簿と座席を設定します（設定UIはβ版）</Text>
        <Box my={3}>
          <LayoutRoot />
        </Box>
      </Box>
    </Box>
  );
};

export default ClassData;
