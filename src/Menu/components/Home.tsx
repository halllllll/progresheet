import { type FC, Suspense } from 'react';
import { Box, Container, Grid, GridItem } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from '@/Menu/components/Header';
import { SideMenu } from './SideMenu';

const Home: FC = () => {
  return (
    <Box>
      <Header />
      <Container maxW="container.lg">
        <Grid templateColumns={`1fr 3fr`} columnGap="50" p={5}>
          <GridItem>
            <SideMenu />
          </GridItem>
          <GridItem>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
