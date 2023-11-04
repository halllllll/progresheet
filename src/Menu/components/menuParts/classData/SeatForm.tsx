import { useState, type FC, useContext } from 'react';
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
  const setLayoutHandler = (data: SeatLayoutData) => {
    setLayout(data);
    menuClassLayoutCtxUpdater({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      seats: data.map(({ id, ...rest }) => {
        return {
          ...rest,
        };
      }),
    });
  };

  const appendHandler = (newSeats: Seat | Seat[]): void => {
    const data: Seat[] = Array.isArray(newSeats) ? newSeats : [newSeats];

    setLayoutHandler([
      ...layout,
      ...data.map((seat) => {
        return { ...seat, id: uuid() };
      }),
    ]);
  };

  const removeHandler = (id: string | string[] | number): void => {
    if (typeof id === 'number') {
      const count = id;
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
      setLayoutHandler(nextLayout);
    } else {
      const data: string[] = Array.isArray(id) ? id : [id];
      const newSeats = [...layout.filter((v) => data.includes(v.id))];
      setLayoutHandler(newSeats);
    }
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
      <ClassName
        name={menuCtx.classLayout.name}
        menuClassLayoutCtxUpdater={menuClassLayoutCtxUpdater}
      />
      <Layout
        layout={layout}
        columnCount={columnCount}
        setLayoutHandler={setLayoutHandler}
      />
      <SendClassData />
    </form>
  );
};
export default SeatForm;
