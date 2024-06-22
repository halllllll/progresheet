import { type MutableRefObject, type FC, useEffect } from 'react';
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
  FormErrorMessage,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import { PickSeatError } from '@/Menu/errors';
import { type SeatDTO, type ClassLayout } from '@/Menu/types';

type Props = {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  seatData: { seat: SeatDTO; orderIndex: number } | null;
  updater: (index: number, data: SeatDTO) => void;
  initialRef: MutableRefObject<null>;
  finalRef: MutableRefObject<null>;
};

const CellModal: FC<Props> = ({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  seatData,
  updater,
}) => {
  if (seatData === null) throw new PickSeatError("Can't Get Seat Info");
  const methods = useFormContext<ClassLayout>();
  const trigger = methods.trigger;
  useEffect(() => {
    void trigger();
  }, [trigger]);

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
        <ModalHeader>{'座席の編集'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <HStack alignItems={'baseline'} justifyContent={'center'}>
            <VStack>
              <Controller
                name={`seats.${seatData.orderIndex}.visible`}
                control={methods.control}
                render={({ field }) => (
                  <FormControl>
                    <FormLabel>{'シート表示'}</FormLabel>
                    <Switch
                      colorScheme="teal"
                      size="lg"
                      {...(methods.register(
                        `seats.${seatData.orderIndex}.visible`
                      ),
                      {
                        defaultChecked: seatData.seat.visible,
                        ref: field.ref,
                        isChecked: field.value,
                        onBlur: field.onBlur,
                        onChange: field.onChange,
                      })}
                    />
                  </FormControl>
                )}
              />
            </VStack>
            <VStack>
              <Controller
                name={`seats.${seatData.orderIndex}.name`}
                control={methods.control}
                render={({ field }) => (
                  <>
                    <FormControl
                      isInvalid={
                        methods.formState.errors.seats?.[seatData.orderIndex] &&
                        true
                      }
                    >
                      <FormLabel>{'シート名'}</FormLabel>
                      <InputGroup size={'lg'}>
                        <InputLeftAddon>{seatData.seat.index}_</InputLeftAddon>
                        <Input
                          placeholder={`${seatData.seat.name ?? ''}`}
                          {...(methods.register(
                            `seats.${seatData.orderIndex}.name`
                          ),
                          {
                            onBlur: field.onBlur,
                            onChange: field.onChange,
                            defaultValue: seatData.seat.name,
                            ref: initialRef,
                          })}
                        />
                      </InputGroup>
                      {methods.formState.errors.seats?.[seatData.orderIndex]
                        ?.name && (
                        <FormErrorMessage>
                          {
                            methods.formState.errors.seats[seatData.orderIndex]
                              ?.name?.message
                          }
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </>
                )}
              />
            </VStack>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={!!methods.formState.errors.seats?.[seatData.orderIndex]}
            colorScheme="blue"
            mr={3}
            onClick={() => {
              updater(
                seatData.orderIndex,
                methods.getValues('seats')[seatData.orderIndex]
              );
              onClose();
            }}
          >
            {'Save'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CellModal;
