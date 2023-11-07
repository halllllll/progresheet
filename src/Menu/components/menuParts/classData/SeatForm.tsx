import { useState, type FC, useContext } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { MenuCtx } from '@/Menu/App';
import SendClassData from './SetClassDataButton';
import AmountManager from './Sheat/Amount/AmountManager';
import ClassName from './Sheat/ClassName/ClassName';
import Layout from './Sheat/SheatLayout/Layout';
import { ContextError } from '@/Menu/errors';
import { type Seat, type ClassLayout } from '@/Menu/types';

export type SeatLayoutData = Array<Seat & { id: string }>;

type Props = {
  defaultColumnCount: number;
  menuClassLayoutCtxUpdater: (data: Partial<ClassLayout>) => void;
};
const SeatForm: FC<Props> = ({
  defaultColumnCount,
  menuClassLayoutCtxUpdater,
}) => {
  const menuCtx = useContext(MenuCtx);

  if (menuCtx === null || menuCtx.classLayout === undefined)
    throw new ContextError('non-context error', { details: 'on SeatForm' });

  const [columnCount, setColumnCount] = useState<number>(defaultColumnCount);
  const [layout, setLayout] = useState<SeatLayoutData>(
    menuCtx.classLayout.seats.map((seat) => {
      return { ...seat, id: uuid() };
    })
  );
  // TODO: ok
  const methods = useFormContext<ClassLayout>();
  const {
    swap: hookFormSwap,
    // update: hookFormUpdate,
    replace: hookFormReplace,
  } = useFieldArray<ClassLayout>({
    control: methods.control,
    name: 'seats',
  });

  // シート用兼useFieldArray用
  const updateLayoutHandler = (data: SeatLayoutData) => {
    setLayout(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newLayout = data.map(({ id, ...rest }) => {
      return { ...rest };
    });
    hookFormReplace(newLayout);
    menuClassLayoutCtxUpdater({
      seats: newLayout,
    });
  };

  const appendHandler = (newSeats: Seat | Seat[]): void => {
    const data: Seat[] = Array.isArray(newSeats) ? newSeats : [newSeats];

    updateLayoutHandler([
      ...layout,
      ...data.map((seat) => {
        return { ...seat, id: uuid() };
      }),
    ]);
  };

  /**
   * delete applied count (if id is number) from backward, or specified id (if id is string)
   * @param id
   * @returns
   */
  const removeHandler = (id: string | string[] | number): void => {
    if (typeof id === 'number') {
      const count = id; // 後ろからcount分は無視し、残った配列のインデックス番号を順番通りに再構成する
      if (count <= 0) return;
      const temp = [...layout.slice(0, -count)];
      const newSeats = [...temp];
      // indexを順番に降りなおす
      const sortedMap: Record<number, number> = [
        ...temp.sort((a, b) => a.index - b.index),
      ].reduce(
        (acc, { index }, newIndex) => ({ ...acc, [index]: newIndex + 1 }),
        {}
      );

      const nextLayout = [
        ...newSeats.map((seat) => {
          // TODO: なんかもっといい方法（ヒットしなかった場合のエラーハンドリングがめんどくさいので確実な方法）
          const target = layout.filter((t) => t.id === seat.id)[0];

          return { ...target, index: sortedMap[target.index] };
        }),
      ];
      updateLayoutHandler(nextLayout);
    } else {
      const data: string[] = Array.isArray(id) ? id : [id];
      const newSeats = [...layout.filter((v) => data.includes(v.id))];
      updateLayoutHandler(newSeats);
    }
  };

  const editHandler = (idx: number, data: Seat) => {
    // TODO: more cool way
    console.warn('pre edit: ');
    console.table(layout);
    layout[idx] = { id: layout[idx].id, ...data };
    console.warn('edited:');
    console.table(layout);
    updateLayoutHandler(layout);
  };

  return (
    <form>
      <AmountManager
        append={appendHandler}
        remove={removeHandler}
        fieldLength={layout.length}
        setColumnCount={setColumnCount}
        menuClassLayoutCtxUpdater={menuClassLayoutCtxUpdater}
      />
      <ClassName menuClassLayoutCtxUpdater={menuClassLayoutCtxUpdater} />
      <Layout
        layout={layout}
        columnCount={columnCount}
        updateLayoutHandler={updateLayoutHandler}
        editHandler={editHandler}
        hookFormSwap={hookFormSwap}
      />
      <SendClassData />
    </form>
  );
};
export default SeatForm;
