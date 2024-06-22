import { type FC, useState } from 'react';
import { Box, Button, Spacer } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  getClassRoomInfoAPI,
  getClassRoomSeatAPI,
} from '@/Menu/API/classRoomAPI';
import { useAppMenuCtx } from '@/Menu/contexts/hook';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  btnText?: string;
};

const GetClassData: FC<Props> = ({ btnText }) => {
  const { menuCtx, setMenuCtx } = useAppMenuCtx('on ClassDataButton');

  const methods = useFormContext<ClassLayout>();
  const [loading, setLoading] = useState<boolean>(false);
  const getSeats = async () => {
    setLoading(true);
    await Promise.all([getClassRoomSeatAPI(), getClassRoomInfoAPI()])
      .then(([seats, data]) => {
        if (seats.length === 0) {
          throw new Error(
            '座席数が0です。異常値なので初期化したほうがいいかもしれません。'
          );
        }
        // Set Default Value for Your App
        methods.setValue('column', data.column);
        methods.setValue('row', data.row);
        methods.setValue('name', data.name);
        methods.setValue('seats', seats);
        setMenuCtx({
          ...menuCtx,
          classLayout: {
            seats,
            ...data,
          },
        });
      })
      .catch((err: unknown) => {
        // TODO: エラー処理
        const e = err as Error;
        console.warn(e);
        toast.error(`エラーです\n${e.name} \n ${e.message}`);
        throw new Error(`${e.name} - ${e.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Box display={'flex'}>
        <Spacer />
        <Button isLoading={loading} onClick={getSeats}>
          {btnText ?? '編集する'}
        </Button>
        <Spacer />
      </Box>
    </>
  );
};

export default GetClassData;
