import { type FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import { type LabelData } from './labels';

type SendButtonProps = {
  text: string;
  disabledCondition: boolean;
};

const SendButton: FC<SendButtonProps> = ({ text, disabledCondition }) => {
  const methods = useFormContext<LabelData>();

  return (
    <Button
      mt="4"
      type="submit"
      disabled={!methods.formState.isValid || methods.formState.isSubmitting}
      isLoading={methods.formState.isSubmitting}
      loadingText="送信中..."
      spinnerPlacement="start"
      colorScheme="telegram"
      isDisabled={disabledCondition}
    >
      {text}
    </Button>
  );
};

export default SendButton;
