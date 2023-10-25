import { type FC, useState } from 'react';
import { Text, HStack, Button } from '@chakra-ui/react';

type Props = {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  setValue: (val: string) => void;
  label: string;
};

const AmountRoller: FC<Props> = ({
  defaultValue = 5,
  minValue = 1,
  maxValue = 10,
  setValue,
  label,
}: Props) => {
  const [num, setNum] = useState<number>(defaultValue);
  const setNumHandler = (n: number) => {
    if (minValue <= n && n <= maxValue) {
      setValue(n.toString());
      setNum(n);
    }
  };

  return (
    <>
      <HStack>
        <Button
          onClick={() => {
            setNumHandler(num - 1);
          }}
          isDisabled={num === minValue}
        >
          -
        </Button>{' '}
        <Text>{`${label}: ${num}`}</Text>
        <Button
          onClick={() => {
            setNumHandler(num + 1);
          }}
          isDisabled={num === maxValue}
        >
          +
        </Button>
      </HStack>
    </>
  );
};
export default AmountRoller;
