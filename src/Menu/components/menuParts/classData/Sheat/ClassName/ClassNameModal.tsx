import { type MutableRefObject, type FC, useState } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  HStack,
  VStack,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { checkUniqueSheetNameAPI } from '@/Menu/API/userAndSheetAPI';
import { UndefinedServerError } from '@/Menu/errors';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialRef: MutableRefObject<null>;
  finalRef: MutableRefObject<null>;
  menuClassLayoutCtxUpdater: (data: Partial<ClassLayout>) => void;
};

const ClassNameModal: FC<Props> = ({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  menuClassLayoutCtxUpdater,
}) => {
  const methods = useFormContext<ClassLayout>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [existMessage, setExistMessage] = useState<string>('');

  const submitHandler = async (name: string) => {
    setIsSubmitting(true);
    await checkUniqueSheetNameAPI(name)
      .then((ret) => {
        if (ret) {
          toast.success(`シート名「${name}」を保存しました`);
          setExistMessage('');
          menuClassLayoutCtxUpdater({
            name,
          });
        } else {
          setExistMessage(
            `「${name}」シートは既に存在しています。別の名前を設定してください。`
          );
        }
      })
      .catch((err: unknown) => {
        if (err instanceof UndefinedServerError) {
          toast.error(`${err.name} \n ${err.message}`);
        } else {
          const e = err as Error;
          toast.error(`謎のエラー！\n${e.name}\n${e.message}`, {
            duration: 5000,
          });
          setExistMessage(e.name);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal
      size={'lg'}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      allowPinchZoom={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{'座席表シート名の編集'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={methods.formState.errors.name !== undefined}>
            <HStack alignItems={'baseline'} justifyContent={'start'}>
              <VStack spacing={'5'}>
                <Text as="b">
                  {'(既存のシート名と重複している場合は保存されません）'}
                </Text>

                <Box>
                  <Controller
                    name="name"
                    control={methods.control}
                    render={({ field }) => (
                      <>
                        <FormLabel>
                          {'シート名（ex: 学年・クラスや授業名など）'}
                        </FormLabel>
                        <Input
                          size={'lg'}
                          placeholder={methods.getValues('name')}
                          {...(methods.register('name'),
                          {
                            ...field,
                            ref: initialRef,
                          })}
                        />
                        {methods.formState.errors.name && (
                          <FormErrorMessage>
                            {methods.formState.errors.name.message}
                          </FormErrorMessage>
                        )}
                        {existMessage && (
                          <Text color="tomato">{existMessage}</Text>
                        )}
                      </>
                    )}
                  />
                </Box>
              </VStack>
            </HStack>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="blue"
            mr={3}
            isDisabled={!!methods.formState.errors.name || isSubmitting}
            isLoading={isSubmitting}
            onClick={() => {
              void submitHandler(methods.getValues('name'));
            }}
          >
            {'Check & Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClassNameModal;
