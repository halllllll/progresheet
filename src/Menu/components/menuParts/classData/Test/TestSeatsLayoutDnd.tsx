/**
 * this is only for poc component
 */

import { type FC } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import TestInnerProvider from './TestInProvider';

type Props = {
  height: number;
  width: number;
};

export type SeatData = {
  id: string;
  index: number;
  isVisible: boolean;
};

const seats: SeatData[] = [
  {
    id: '1111',
    index: 1,
    isVisible: false,
  },
  {
    id: '2222',
    index: 2,
    isVisible: true,
  },
  {
    id: '3333',
    index: 3,
    isVisible: false,
  },
  {
    id: '4444',
    index: 4,
    isVisible: false,
  },
  {
    id: '5555',
    index: 5,
    isVisible: false,
  },
  {
    id: '6666',
    index: 6,
    isVisible: true,
  },
  {
    id: '7777',
    index: 7,
    isVisible: false,
  },
  {
    id: '8888',
    index: 8,
    isVisible: true,
  },
  {
    id: '9999',
    index: 9,
    isVisible: true,
  },
  {
    id: '10',
    index: 10,
    isVisible: true,
  },
  {
    id: '11',
    index: 11,
    isVisible: true,
  },
  {
    id: '12',
    index: 12,
    isVisible: false,
  },
  {
    id: '13',
    index: 13,
    isVisible: false,
  },
  {
    id: '14',
    index: 14,
    isVisible: true,
  },
  {
    id: '15',
    index: 15,
    isVisible: false,
  },
  {
    id: '16',
    index: 16,
    isVisible: false,
  },
  {
    id: '17',
    index: 17,
    isVisible: false,
  },
  {
    id: '18',
    index: 18,
    isVisible: false,
  },
];

const schema = yup.object().shape({
  seats: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          id: yup.string().required('ユニークな必須だよん'),
          index: yup.number().required('ユニークなindex必須だよん'),
          isVisible: yup.boolean().required('表示設定必須だよん'),
        })
        .required()
    )
    .required(),
});

// const schema = yup.object().shape({
//   id: yup.string().required('ユニークな必須だよん'),
//   index: yup.number().required('ユニークなindex必須だよん'),
//   isVisible: yup.boolean().required('表示設定必須だよん'),
// });

const TestSheatsLayout: FC<Props> = ({ width, height }) => {
  const methods = useForm<{ seats: SeatData[] }>({
    mode: 'all',
    criteriaMode: 'all',
    shouldUnregister: false,
    resolver: yupResolver(schema),
    defaultValues: { seats },
  });

  return (
    <Box>
      <Text>testだよん</Text>
      <FormProvider {...methods}>
        <TestInnerProvider width={width} height={height} />
      </FormProvider>
    </Box>
  );
};

export default TestSheatsLayout;
