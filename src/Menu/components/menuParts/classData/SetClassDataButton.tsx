import { type FC } from 'react';
import { Box, Button, Spacer } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { type ClassLayout } from '@/Menu/types';

const SendClassData: FC = () => {
  // const [loading, setLoading] = useState<boolean>(false);
  const methods = useFormContext<ClassLayout>();

  return (
    <>
      <Box display={'flex'} my={10}>
        <Button type="submit" isLoading={methods.formState.isSubmitting}>
          {'シートを作成する'}
        </Button>
        <Spacer />
      </Box>
    </>
  );
};

export default SendClassData;
