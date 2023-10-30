import { type FC, type RefObject } from 'react';
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  VStack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { type SubmitHandler, useFormContext } from 'react-hook-form';
import { type InitOptions } from '@/Menu/AppsScript/service';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // onPost: () => Promise<void>;
  onPost: SubmitHandler<InitOptions>;
  initialRef?: RefObject<HTMLInputElement>;
};

const InitModal: FC<ModalProps> = (props) => {
  const { isOpen, onClose, initialRef, onPost } = props;
  const methods = useFormContext<InitOptions>();
  const editorsSwitch = methods.watch('withEditors');

  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        size={'xl'}
        isCentered
        allowPinchZoom={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{'本当に初期化しますか？'}</ModalHeader>
          <ModalBody pb={6}>
            <form onSubmit={methods.handleSubmit(onPost)}>
              <Box>
                <VStack gap={5}>
                  <FormControl id="desc">
                    <HStack alignContent={'center'}>
                      <FormLabel htmlFor="desc" my={'auto'}>
                        {'初期化後も編集権限アカウントを引き継ぐ'}
                      </FormLabel>
                      <Switch
                        colorScheme="purple"
                        size="lg"
                        onChange={(e) => {
                          methods.setValue('withEditors', e.target.checked);
                        }}
                        {...(methods.register('withEditors'),
                        {
                          ref: initialRef,
                        })}
                        defaultChecked
                      />
                    </HStack>
                  </FormControl>
                  <Box
                    visibility={editorsSwitch ?? false ? 'hidden' : 'visible'}
                  >
                    <Text color="chocolate">
                      {'＊初期化後は編集者アカウントを別途設定してね！'}
                    </Text>
                  </Box>
                  <HStack mt="4" gap="10" justifyContent="space-around">
                    <Button
                      type="button"
                      onClick={onClose}
                      colorScheme="twitter"
                    >
                      {'やっぱりやめる'}
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !methods.formState.isValid ||
                        methods.formState.isSubmitting
                      }
                      isLoading={methods.formState.isSubmitting}
                      loadingText="初期化中..."
                      spinnerPlacement="start"
                      colorScheme="red"
                    >
                      Yes
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InitModal;
