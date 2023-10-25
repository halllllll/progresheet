import { type FC } from 'react';
import { Button } from '@chakra-ui/react';
import { type UseFieldArrayReturn } from 'react-hook-form';
import { type LabelData } from '../labels';

type AddButtonProps = {
  append: UseFieldArrayReturn<LabelData>['append'];
  text: string;
};

const AddButton: FC<AddButtonProps> = ({ append, text }) => {
  return (
    <Button
      type="button"
      onClick={() => {
        append({
          value: 'ラベルだよ！',
          color: '#eeeeee',
        });
      }}
    >
      {text}
    </Button>
  );
};

export default AddButton;
