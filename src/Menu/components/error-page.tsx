import { type FC } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorPage: FC = () => {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <Box id="error-page" m={4}>
        <Heading size={'lg'}>Oops! {error.status}</Heading>
        <Text>{error.statusText}</Text>
        <Text>{error.data}</Text>
      </Box>
    );
  } else if (error instanceof Error) {
    return (
      <Box id="error-page" m={4}>
        <Box p={4}>
          <Heading size={'lg'}>Oops! Unexpected Error</Heading>
          <Text>Something went wrong.</Text>
          <Text as={'i'}>{error.message}</Text>
        </Box>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default ErrorPage;
