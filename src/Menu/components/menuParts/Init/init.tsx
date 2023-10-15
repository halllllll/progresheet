import { type FC } from 'react';
import {
  Box,
  HStack,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';
import InitForm from './initForm';
import { type InitOptions } from '@/Menu/AppsScript/service';

const InitSheet: FC = () => {
  const methods = useForm<InitOptions>({
    mode: 'all',
    criteriaMode: 'all',
    defaultValues: {
      withEditors: true,
    },
  });

  return (
    <Box>
      <Heading variant="h2" size="lg">
        初期化
      </Heading>
      <Box py={5}>
        <Text my={2}>
          シートを初期状態に戻します。シートの数や設定を最初からやり直したいときなどに使ってください。
        </Text>
        <List
          spacing={3}
          m={3}
          p={5}
          border="1px"
          borderRadius="md"
          borderColor="sienna"
        >
          <HStack>
            <ListIcon as={FiCheckCircle} color="green.500" />
            <ListItem>{'設定シート以外のシートが全て削除されます。'}</ListItem>
          </HStack>
          <HStack>
            <ListIcon as={FiCheckCircle} color="green.500" />
            <ListItem>
              {
                '設定シートはデフォルト値になります。書式・値がリセットされますが、セルの大きさなど一部の設定はそのままになることがあります。'
              }
            </ListItem>
          </HStack>
          <HStack>
            <ListIcon as={FiCheckCircle} color="green.500" />
            <ListItem>
              {
                '共同編集者を引き継ぎたい場合は、初期化確認画面で設定できます（設定しない場合、共同編集者はすべて削除されます。）'
              }
            </ListItem>
          </HStack>
          <HStack>
            <ListIcon as={FiCheckCircle} color="green.500" />
            <ListItem>
              {
                '初期化後は、基本的に「ラベル設定」「クラス設定」を済ませてから使用する想定です。'
              }
            </ListItem>
          </HStack>
        </List>
      </Box>
      <FormProvider {...methods}>
        <InitForm />
      </FormProvider>
    </Box>
  );
};

export default InitSheet;
