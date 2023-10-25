import { useState, type FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import SendClassData from './SetClassDataButton';
import AmountManager from './Sheat/AmountManager';
import Layout from './Sheat/Layout';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  defaultColumnCount: number;
};
const SeatForm: FC<Props> = ({ defaultColumnCount }) => {
  const methods = useFormContext<ClassLayout>();
  const [columnCount, setColumnCount] = useState<number>(defaultColumnCount);
  const { fields, append, remove } = useFieldArray<ClassLayout>({
    name: 'seats',
    shouldUnregister: false,
    control: methods.control,
  });

  return (
    <form>
      <AmountManager
        append={append}
        remove={remove}
        fields={fields}
        setColumnCount={setColumnCount}
      />
      <Layout fields={fields} columnCount={columnCount} />
      <SendClassData />
    </form>
  );
};
export default SeatForm;
