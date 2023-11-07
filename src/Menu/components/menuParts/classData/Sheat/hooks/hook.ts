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

export const UseLayout = (
  defaultColumnCount: number
): {
  columnCount: number;
  setColumnCount: Dispatch<SetStateAction<number>>;
  layout: SeatLayoutData;
  setLayout: Dispatch<SetStateAction<SeatLayoutData>>;
} => {
  const { menuCtx } = useAppMenuCtx();
  if (!menuCtx.classLayout)
    throw new ContextError('non-context "ClassLayout" error');

  const [columnCount, setColumnCount] = useState<number>(defaultColumnCount);
  const [layout, setLayout] = useState<SeatLayoutData>(
    menuCtx.classLayout.seats.map((seat) => {
      return { ...seat, id: uuid() };
    })
  );

  return { columnCount, setColumnCount, layout, setLayout };
};

// TODO:? updateLayoutHandlerをなんとかする

// export const appendHandler = (
//   layout: SeatLayoutData,
//   newSeats: Seat | Seat[]
// ): void => {
//   const data: Seat[] = Array.isArray(newSeats) ? newSeats : [newSeats];

//   UpdateLayoutHandler([
//     ...layout,
//     ...data.map((seat) => {
//       return { ...seat, id: uuid() };
//     }),
//   ]);
// };

/**
 * delete applied count (if id is number) from backward, or specified id (if id is string)
 * @param id
 * @returns
 */
// export const removeHandler = (
//   layout: SeatLayoutData,
//   id: string | string[] | number
// ): void => {
//   if (typeof id === 'number') {
//     const count = id; // 後ろからcount分は無視し、残った配列のインデックス番号を順番通りに再構成する
//     if (count <= 0) return;
//     const temp = [...layout.slice(0, -count)];
//     const newSeats = [...temp];
//     // indexを順番に降りなおす
//     const sortedMap: Record<number, number> = [
//       ...temp.sort((a, b) => a.index - b.index),
//     ].reduce(
//       (acc, { index }, newIndex) => ({ ...acc, [index]: newIndex + 1 }),
//       {}
//     );

//     const nextLayout = [
//       ...newSeats.map((seat) => {
//         // TODO: なんかもっといい方法（ヒットしなかった場合のエラーハンドリングがめんどくさいので確実な方法）
//         const target = layout.filter((t) => t.id === seat.id)[0];

//         return { ...target, index: sortedMap[target.index] };
//       }),
//     ];
//     updateLayoutHandler(nextLayout);
//   } else {
//     const data: string[] = Array.isArray(id) ? id : [id];
//     const newSeats = [...layout.filter((v) => data.includes(v.id))];
//     updateLayoutHandler(newSeats);
//   }
// };

// export const editHandler = (
//   layout: SeatLayoutData,
//   idx: number,
//   data: Seat
// ): void => {
//   layout[idx] = { id: layout[idx].id, ...data };
//   updateLayoutHandler(layout);
// };
