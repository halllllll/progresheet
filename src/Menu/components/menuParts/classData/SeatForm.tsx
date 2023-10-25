import { type FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import SendClassData from './SetClassDataButton';
import AmountManager from './Sheat/AmountManager';
import Layout from './Sheat/Layout';
import { type ClassLayout } from '@/Menu/types';

const SeatForm: FC = () => {
  const methods = useFormContext<ClassLayout>();
  const { fields, append, remove } = useFieldArray<ClassLayout>({
    name: 'seats',
    shouldUnregister: false,
    control: methods.control,
  });

  return (
    <form>
      <AmountManager append={append} remove={remove} fields={fields} />
      <Layout fields={fields} />
      <SendClassData />
    </form>
  );
};
export default SeatForm;
