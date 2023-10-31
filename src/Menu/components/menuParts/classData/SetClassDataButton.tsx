import { type FC } from 'react';
import { Box, Button, Spacer } from '@chakra-ui/react';

const SendClassData: FC = () => {
  // const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Box display={'flex'} my={10}>
        <Spacer />
        <Button>{'シートを作成する'}</Button>
        <Spacer />
      </Box>
    </>
  );
};

export default SendClassData;
