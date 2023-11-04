import { type MutableRefObject, type FC } from 'react';
import {
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
  InputGroup,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialRef: MutableRefObject<null>;
  finalRef: MutableRefObject<null>;
  name: string;
  setNameHandler?: (e: any) => void;
};

const ClassNameModal: FC<Props> = ({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  name,
  setNameHandler,
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
        {/* <form
          onSubmit={methods.handleSubmit((v) => {
            console.warn('wa~');
            console.warn(v);
          })}
        > */}
        <FormControl isInvalid={methods.formState.errors.name !== undefined}>
          {methods.formState.errors.name?.type}
          <ModalBody pb={6}>
            <HStack alignItems={'baseline'} justifyContent={'center'}>
              <VStack spacing={'5'}>
                <Text as="b">
                  {'(既存のシート名と重複している場合は保存されません）'}
                </Text>

                <FormLabel>
                  {'シート名（ex: 学年・クラスや授業名など）'}
                </FormLabel>
                <InputGroup size={'lg'}>
                  <Input
                    placeholder={name}
                    // onChange={setNameHandler}
                    {...(methods.register('name'),
                    {
                      ref: initialRef,
                      onChange: setNameHandler,
                    })}
                  />
                </InputGroup>
                {methods.formState.errors.name && (
                  <FormErrorMessage>
                    エラーだよ {methods.formState.errors.name.message}
                  </FormErrorMessage>
                )}
              </VStack>
            </HStack>
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              colorScheme="blue"
              mr={3}
              isDisabled={!!methods.formState.errors.name}
            >
              Save
            </Button>
          </ModalFooter>
        </FormControl>
        {/* </form> */}
      </ModalContent>
    </Modal>
  );
};

export default ClassNameModal;
