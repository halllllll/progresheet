import { type FC, useContext } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { MenuCtx } from '../App';

const Parent: FC = () => {
  const _yo = useContext(MenuCtx);
  console.log(`yo! ${_yo === null ? 'omg..' : _yo.userID + '!!!!'}`);

  return (
    <Box>
      <Text>yo! {_yo?.userID} !!!</Text>
      <Text>sheetname: {_yo?.sheetName} !!!!!</Text>
    </Box>
  );
};

export default Parent;
