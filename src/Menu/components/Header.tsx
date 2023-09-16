import { type FC } from 'react';
import { Flex, Heading, VStack } from '@chakra-ui/react';

type headerProps = {
  title?: string;
};

const Header: FC<headerProps> = (props) => {
  const title = props.title ?? '管理画面メニュー';

  return (
    <VStack>
      <Flex
        w="100%" // 100vwだと一定の幅以下で文頭が左端にめり込んだことがあった
        h="8vh"
        as="header"
        position="sticky"
        pos="relative"
        align="center"
        justify="center"
        bg="blackAlpha.100"
      >
        <Heading as="h1" size="xl">
          {title}
        </Heading>
      </Flex>
    </VStack>
  );
};

export default Header;
