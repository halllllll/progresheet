import { type FC } from 'react';
import { Box, Heading, List, ListIcon, ListItem, Text } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { FiCheckCircle } from 'react-icons/fi';
import InitForm from './initForm';

const InitSheet: FC = () => {
  const methods = useForm({
    mode: 'all',
    criteriaMode: 'all',
  });

  return (
    <Box>
      <Heading variant="h2" size="lg">
        初期化だよ！
      </Heading>
      <Box py={5}>
        <Text>
          シートを初期状態に戻します。シートの数や設定を最初からやり直したいときなどに気軽に使ってください
        </Text>
        <List spacing={3} py={5}>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Assumenda, quia temporibus eveniet a libero incidunt suscipit
          </ListItem>
          <ListItem>
            <ListIcon as={FiCheckCircle} color="green.500" />
            Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
          </ListItem>
        </List>
      </Box>
      <FormProvider {...methods}>
        <InitForm />
      </FormProvider>
    </Box>
  );
};

export default InitSheet;
