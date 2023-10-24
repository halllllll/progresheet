import { type FC, type Dispatch, type SetStateAction, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
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
  const [loading, setLoading] = useState<boolean>(false);
  const getSeats = async () => {
    setLoading(true);
    await Promise.all([getClassRoomSeatAPI(), getClassRoomInfoAPI()])
      .then(([seats, data]) => {
        setClassData({ seats, ...data });
      })
      .catch((err: unknown) => {
        // TODO: エラー処理
        const e = err as Error;
        console.warn(e);
        toast.error(`エラーだよ！ \n${e.name} \n ${e.message}`);
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
