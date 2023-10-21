import { type FC } from 'react';
import { Box, HStack, Heading, Text, Tooltip } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { RiInformationFill } from 'react-icons/ri';
import LayoutRoot from './Sheat/LayoutRoot';

const ClassData: FC = () => {
  const _methods = useFormContext();

  return (
    <Box>
      <Heading variant="h2" size="lg">
        {'クラス作成'}
      </Heading>
      <Box py={5}>
        <HStack>
          <Text>{'クラス名簿と座席を作成します（設定UIはβ版）'}</Text>
          <Tooltip
            label={
              '編集ではなく、新規作成です。現在の状態を反映・更新するのではなく、新しく生成されます。'
            }
            fontSize="lg"
            placement="top"
            p={3}
            hasArrow
          >
            <Text>
              <RiInformationFill />
            </Text>
          </Tooltip>
        </HStack>
        <Box my={3}>
          <LayoutRoot />
        </Box>
      </Box>
    </Box>
  );
};

export default ClassData;
