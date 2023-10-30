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
  InputGroup,
} from '@chakra-ui/react';

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
  return (
    <Modal
      size={'lg'}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{'座席表シート名の編集'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <HStack alignItems={'baseline'} justifyContent={'center'}>
            <VStack>
              <FormControl>
                <FormLabel>{'シート名'}</FormLabel>
                <InputGroup size={'lg'}>
                  <Input ref={initialRef} placeholder={`あひ〜ん`} />
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
