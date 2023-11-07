import { type FC } from 'react';
import { v4 as uuid } from 'uuid';
import SendClassData from './SetClassDataButton';
import AmountManager from './Sheat/Amount/AmountManager';
import ClassName from './Sheat/ClassName/ClassName';
import Layout from './Sheat/SheatLayout/Layout';
import { UseLayout, UseSeatFieldArray } from './Sheat/hooks/hook';
import { useAppMenuCtx } from '@/Menu/contexts/hook';
import { ContextError } from '@/Menu/errors';
import { type ClassLayout, type SeatDTO } from '@/Menu/types';

export type SeatLayoutData = Array<SeatDTO & { id: string }>;

type Props = {
  defaultColumnCount: number;
  menuClassLayoutCtxUpdater: (data: Partial<ClassLayout>) => void;
};
const SeatForm: FC<Props> = ({
  defaultColumnCount,
  menuClassLayoutCtxUpdater,
}) => {
  const { menuCtx } = useAppMenuCtx('on SeatForm');
  if (menuCtx.classLayout === undefined)
    throw new ContextError('non-context error', { details: 'on SeatForm' });

  const { columnCount, setColumnCount, layout, setLayout } =
    UseLayout(defaultColumnCount);

  const { hookFormSwap, hookFormReplace } = UseSeatFieldArray();

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

  const appendHandler = (newSeats: SeatDTO | SeatDTO[]): void => {
    const data: SeatDTO[] = Array.isArray(newSeats) ? newSeats : [newSeats];

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

  const editHandler = (idx: number, data: SeatDTO) => {
    layout[idx] = { id: layout[idx].id, ...data };
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
