import { type FC } from 'react';
import {
  Box,
  HStack,
  Switch,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { type Editor } from '@/Menu/types';

type EditorTableProps = {
  editors: Editor[];
  myId: string;
};

const EditorTable: FC<EditorTableProps> = (props) => {
  const { editors, myId } = props;

  return (
    <Box>
      <Table variant={'simple'} size={'sm'} colorScheme={'blackAlpha'}>
        <Thead>
          <Tr>
            <Th textAlign={'center'} w={'65%'} fontSize={'md'}>
              {'ID'}
            </Th>
            <Th textAlign={'center'} fontSize={'md'}>
              {'編集権限'}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {editors.map((editor) => {
            return (
              <Tr key={editor.id} my="xl">
                <Td>
                  <Text>
                    <HStack>
                      <>
                        <Text>{editor.id}</Text>
                        {editor.id === myId && (
                          <Tag
                            variant={'solid'}
                            borderRadius={'full'}
                            colorScheme={'linkedin'}
                            minW={'fit-content'}
                          >
                            <TagLabel>{'You!'}</TagLabel>
                          </Tag>
                        )}
                      </>
                    </HStack>
                  </Text>
                </Td>
                <Td>
                  <HStack justifyContent={'space-evenly'}>
                    <Text>{'No'}</Text>
                    <Switch
                      defaultChecked={editor.editable}
                      size={'lg'}
                      disabled={editor.id === myId}
                    />
                    <Text>{'OK'}</Text>
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default EditorTable;
