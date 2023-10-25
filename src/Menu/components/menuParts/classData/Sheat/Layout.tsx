import { useContext, type FC } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { useFormContext, type UseFieldArrayReturn } from 'react-hook-form';
import { ClassDataCtx, SetClassDataCtx } from '../classData';

import Cell from './Cell';
import { ContextError } from '@/Menu/errors';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  fields: UseFieldArrayReturn<ClassLayout>['fields'];
  columnCount: number;
};

const Layout: FC<Props> = ({ fields, columnCount }) => {
  const _setClassDataCtx = useContext(SetClassDataCtx);
  const classDataCtx = useContext(ClassDataCtx);
  if (classDataCtx === null)
    throw new ContextError('non-context error', {
      details: 'on AmountManager',
    });
  const _methods = useFormContext<ClassLayout>();

  return (
    <Box maxH={'md'} maxW={'md'} overflow={'scroll'}>
      <Box w="max-content">
        <Box>
          <SimpleGrid spacing={'4px'} columns={columnCount}>
            {fields.map((seat, id) => {
              return (
                <Box key={id}>
                  <Cell
                    index={seat.index}
                    name={seat.name}
                    visible={seat.visible}
                  />
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
