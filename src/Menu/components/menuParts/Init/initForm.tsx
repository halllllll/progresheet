import { type FC, useRef } from 'react';
import { Button, Center, useDisclosure } from '@chakra-ui/react';
import { type SubmitHandler, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PropagateLoader } from 'react-spinners';
import InitModal from './modal';
import initAPI from '@/Menu/API/initAPI';
import { type InitOptions } from '@/Menu/AppsScript/service';
import Full from '@/Menu/components/loader';
import { InitError, UndefinedServerError } from '@/Menu/errors';

const InitForm: FC = () => {
  const methods = useFormContext<InitOptions>();

  // modal用ref
  const initialRef = useRef<HTMLInputElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onPost: SubmitHandler<InitOptions> = async (data) => {
    await initAPI(data)
      .then((res) => {
        console.log(JSON.stringify(res));
        toast.success('初期化成功！');
      })
      .catch((err: unknown) => {
        // TODO: 下手くそ
        if (err instanceof InitError) {
          toast.error(
            `初期化エラーが発生したよ！\n${err.name}\n${err.message}`,
            {
              duration: 8000,
            }
          );
        } else if (err instanceof UndefinedServerError) {
          toast.error(
            `未定義エラーが発生したよ！\n${err.name}\n${err.message}`,
            {
              duration: 8000,
            }
          );
        } else {
          const e = err as Error;
          toast.error(`謎のエラーが発生したよ！\n${e.name}\n${e.message}`, {
            duration: 8000,
          });
        }
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <>
      {methods.formState.isSubmitting && (
        <Full>
          <PropagateLoader
            color="#36d7b7"
            size={20}
            aria-label="Loading Spinner"
            loading={methods.formState.isSubmitting}
          />
        </Full>
      )}
      <InitModal
        isOpen={isOpen}
        onClose={onClose}
        onPost={onPost}
        initialRef={initialRef}
      />
      <Center>
        <Button mt="4" colorScheme="red" onClick={onOpen}>
          {'初期化する？'}
        </Button>
      </Center>
    </>
  );
};

export default InitForm;
