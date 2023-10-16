import {
  type Dispatch,
  type SetStateAction,
  type FC,
  type ChangeEvent,
} from 'react';
import {
  Box,
  Button,
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
  VisuallyHiddenInput,
} from '@chakra-ui/react';
import { type Editor } from '@/Menu/types';

type EditorTableProps = {
  editors: Editor[];
  setEditors: Dispatch<SetStateAction<Editor[]>>;
  isLoading: boolean;
  myId: string;
  onSubmit: (editors: Editor[]) => void;
};

const EditorTable: FC<EditorTableProps> = (props) => {
  const { editors, setEditors, isLoading, myId, onSubmit } = props;

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
          {editors.map((editor, idx) => {
            return (
              <Tr key={editor.useId} my="xl">
                <Td>
                  <Text>
                    <HStack>
                      <>
                        <Text>{editors[idx].useId}</Text>
                        <VisuallyHiddenInput value={editors[idx].useId} />
                        {editors[idx].useId === myId && (
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
                      defaultChecked={editors[idx].editable}
                      size={'lg'}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        editors[idx].editable = e.target.checked;
                        setEditors(editors);
                      }}
                      disabled={editors[idx].useId === myId}
                    />
                    <Text>{'OK'}</Text>
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Button
        type="submit"
        onClick={() => {
          onSubmit(editors);
        }}
        isDisabled={isLoading}
        isLoading={isLoading}
        loadingText="送信中..."
        spinnerPlacement="start"
      >
        送信
      </Button>
    </Box>
  );
};

export default EditorTable;
