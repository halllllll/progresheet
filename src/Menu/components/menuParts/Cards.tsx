import { type FC } from 'react';
import { Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

/**
 * TODO:
 * all code in this file are only for practice of `react-router-dom`.
 * so, whole file itself should be DELETED later, soon.
 */

type CardProps = {
  message?: string;
};

const Card: FC<CardProps> = ({ message }) => {
  const location = useLocation();

  return (
    <>
      <Box>Here is {message}. </Box>
      <Box>state: {location.state}</Box>
    </>
  );
};

export default Card;
