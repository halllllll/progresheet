import { type FC } from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Seat from './TestSeatData';
import { type SeatData } from './TestSeatsLayoutDnd';

type Props = {
  width: number;
  height: number;
};

const TestInnerProvider: FC<Props> = ({ width }) => {
  const methods = useFormContext<{ seats: SeatData[] }>();

  const { fields } = useFieldArray<{ seats: SeatData[] }>({
    name: 'seats',
    control: methods.control,
    shouldUnregister: false,
  });

  return (
    <>
      <Text>{'under testing'}</Text>
      <Box maxH={'md'} maxW={'md'} overflow={'scroll'}>
        <Box w="max-content">
          <SimpleGrid spacing={'4px'} columns={width}>
            {fields.map((field, idx) => {
              return (
                <Box key={idx}>
                  <Seat
                    id={field.id}
                    index={field.index}
                    isVisible={field.isVisible}
                  />
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};

export default TestInnerProvider;
