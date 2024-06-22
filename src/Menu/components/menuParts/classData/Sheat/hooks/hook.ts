import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type SensorDescriptor,
  type SensorOptions,
} from '@dnd-kit/core';
import {
  type UseFieldArraySwap,
  useFieldArray,
  useFormContext,
  type UseFieldArrayReplace,
} from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { type SeatLayoutData } from '../../SeatForm';
import { useAppMenuCtx } from '@/Menu/contexts/hook';
import { ContextError } from '@/Menu/errors';
import { type ClassLayout } from '@/Menu/types';

// sensorの定義。
export const useDndSensors = (): Array<SensorDescriptor<SensorOptions>> => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // マウスの場合は10px動いたらドラッグと判断
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // タッチの場合は200ミリ秒押下かつ5px動いたらドラッグと判断
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  return sensors;
};

// Dnd and useFieldArray 定義

export const UseSeatFieldArray = (): {
  hookFormSwap: UseFieldArraySwap;
  hookFormReplace: UseFieldArrayReplace<ClassLayout>;
} => {
  const methods = useFormContext<ClassLayout>();
  const {
    swap: hookFormSwap,
    // update: hookFormUpdate,
    replace: hookFormReplace,
  } = useFieldArray<ClassLayout>({
    control: methods.control,
    name: 'seats',
  });

  return { hookFormSwap, hookFormReplace };
};

export const UseLayout = (): {
  layout: SeatLayoutData;
  setLayout: Dispatch<SetStateAction<SeatLayoutData>>;
} => {
  const { menuCtx } = useAppMenuCtx();
  if (!menuCtx.classLayout)
    throw new ContextError('non-context "ClassLayout" error');

  const [layout, setLayout] = useState<SeatLayoutData>(
    menuCtx.classLayout.seats.map((seat) => {
      return { ...seat, id: uuid() };
    })
  );

  return { layout, setLayout };
};
