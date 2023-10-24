import {
  type FC,
  type Dispatch,
  type SetStateAction,
  useState,
  createContext,
} from 'react';
import { Box, HStack, Heading, Text, Tooltip } from '@chakra-ui/react';
import { RiInformationFill } from 'react-icons/ri';
import GetClassData from './GetClassDataButton';
import SendClassData from './SetClassDataButton';
import LayoutRoot from './Sheat/LayoutRoot';
import { type ClassLayout } from '@/Menu/types';

export const ClassDataCtx = createContext<ClassLayout | null>(null);
export const SetClassDataCtx = createContext<
  Dispatch<SetStateAction<ClassLayout | null>>
>(() => null);

const ClassData: FC = () => {
  const [classData, setClassData] = useState<ClassLayout | null>(null);

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
      </Box>
      <Box py={5}>
        {/** TODO: FORM, method, and so? */}
        {classData === null || classData?.seats?.length === 0 ? (
          <GetClassData setClassData={setClassData} />
        ) : (
          <SetClassDataCtx.Provider value={setClassData}>
            <ClassDataCtx.Provider value={classData}>
              <LayoutRoot />
              <SendClassData />
            </ClassDataCtx.Provider>
          </SetClassDataCtx.Provider>
        )}
      </Box>
    </Box>
  );
};

export default ClassData;
