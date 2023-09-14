import { type FC, useContext } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { MyCtx } from '../App';

const Parent: FC = () => {
  const _yo = useContext(MyCtx);
  console.log(`yo! ${_yo === null ? 'omg..' : _yo.userID + '!!!!'}`);

  return (
    <Box>
      <Text>yo! {_yo?.userID} !!!</Text>
    </Box>
  );
};

export default Parent;
