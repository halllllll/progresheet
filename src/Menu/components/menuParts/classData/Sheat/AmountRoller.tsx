import { type FC } from 'react';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from '@chakra-ui/react';

type Props = {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  setValue: (val: string) => void;
  label: string;
};

// TODO: NOT YET implementation, JUST pseudo data!!!!

const AmountRoller: FC<Props> = ({
  defaultValue = 5,
  minValue = 1,
  maxValue = 10,
  setValue,
  label,
}: Props) => {
  return (
    <>
      <Text>{`${label}: `}</Text>
      <NumberInput
        size="md"
        maxW={24}
        defaultValue={defaultValue}
        min={minValue}
        max={maxValue}
        onChange={setValue}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </>
  );
};
export default AmountRoller;
