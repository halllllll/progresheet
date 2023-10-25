import { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import SendClassData from './SetClassDataButton';
import AmountManager from './Sheat/AmountManager';
import Layout from './Sheat/Layout';
import { type ClassLayout } from '@/Menu/types';

const SeatForm: FC = () => {
  const _methods = useFormContext<ClassLayout>();

  return (
    <form>
      <AmountManager />
      <Layout />
      <SendClassData />
    </form>
  );
};
export default SeatForm;
