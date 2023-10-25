import { type FC, useState, type Dispatch, type SetStateAction } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  getClassRoomInfoAPI,
  getClassRoomSeatAPI,
} from '@/Menu/API/classRoomAPI';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  setClassData: Dispatch<SetStateAction<ClassLayout | null>>;
};
const GetClassData: FC<Props> = ({ setClassData }) => {
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
        methods.setValue('column', data.column);
        methods.setValue('row', data.row);
        methods.setValue('name', data.name);
        methods.setValue('seats', seats);
        setClassData({ seats, ...data });
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
      <Box>
        <Button isLoading={loading} onClick={getSeats}>
          {'編集する'}
        </Button>
      </Box>
    </>
  );
};

export default GetClassData;
