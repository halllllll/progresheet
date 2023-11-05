import { type MutableRefObject, type FC } from 'react';
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
import { type ClassLayout } from '@/Menu/types';

type Props = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialRef: MutableRefObject<null>;
  finalRef: MutableRefObject<null>;
};

const ClassNameModal: FC<Props> = ({
  isOpen,
  onClose,
  initialRef,
  finalRef,
}) => {
  const methods = useFormContext<ClassLayout>();

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
            isDisabled={!!methods.formState.errors.name}
          >
            {'Check & Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClassNameModal;
