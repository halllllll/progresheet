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
  Switch,
  HStack,
  VStack,
  InputLeftAddon,
  InputGroup,
} from '@chakra-ui/react';
import { PickSeatError } from '@/Menu/errors';
import { type Seat } from '@/Menu/types';

type Props = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  seat: Seat | null;
  initialRef: MutableRefObject<null>;
  finalRef: MutableRefObject<null>;
};

const CellModal: FC<Props> = ({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  seat,
}) => {
  if (seat === null) throw new PickSeatError("Can't Get Seat Info");

  return (
    <Modal
      size={'lg'}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{'座席の編集'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <HStack alignItems={'baseline'} justifyContent={'center'}>
            <VStack>
              <FormControl>
                <FormLabel>{'シート表示'}</FormLabel>
                <Switch
                  colorScheme="teal"
                  size="lg"
                  defaultChecked={seat.visible}
                />
              </FormControl>
            </VStack>
            <VStack>
              <FormControl>
                <FormLabel>{'シート名'}</FormLabel>
                <InputGroup size={'lg'}>
                  <InputLeftAddon>{seat.index}_</InputLeftAddon>
                  <Input ref={initialRef} placeholder={`${seat.name}`} />
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

export default CellModal;
