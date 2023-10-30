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
} from '@chakra-ui/react';

type Props = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  initialRef: MutableRefObject<null>;
  finalRef: MutableRefObject<null>;
  name: string;
  setNameHandler: (e: any) => void;
};

const ClassNameModal: FC<Props> = ({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  name,
  setNameHandler,
}) => {
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
          <HStack alignItems={'baseline'} justifyContent={'center'}>
            <VStack spacing={'5'}>
              <Text as="b">
                {'(既存のシート名と重複している場合は保存されません）'}
              </Text>

              <FormControl>
                <FormLabel>
                  {'シート名（ex: 学年・クラスや授業名など）'}
                </FormLabel>
                <InputGroup size={'lg'}>
                  <Input
                    ref={initialRef}
                    placeholder={name}
                    onChange={setNameHandler}
                  />
                </InputGroup>
              </FormControl>
            </VStack>
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClassNameModal;
