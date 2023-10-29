import { type FC, useCallback } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSwappingStrategy,
  arraySwap,
} from '@dnd-kit/sortable';

import { type SeatLayoutData } from '../SeatForm';
import Cell from './Cell';
import Sortable from './Sortable';

type Props = {
  layout: SeatLayoutData;
  columnCount: number;
  setLayoutHandler: (data: SeatLayoutData) => void;
};

const Layout: FC<Props> = ({ layout, columnCount, setLayoutHandler }) => {
  //  drag 終了時に発火するハンドラ
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over === null) return;
      if (active.id !== over.id) {
        const oldIndex = layout.findIndex((field) => field.id === active.id);
        const newIndex = layout.findIndex((field) => field.id === over.id);
        const newStates = arraySwap(layout, oldIndex, newIndex);
        setLayoutHandler(newStates);
      }
    },
    [layout, setLayoutHandler]
  );

  // sensorの定義。
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

  return (
    <Box maxH={'md'} maxW={'md'} overflow={'scroll'}>
      <Box w="max-content">
        <Box>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={layout} strategy={rectSwappingStrategy}>
              <SimpleGrid spacing={'4px'} columns={columnCount}>
                {layout.map((seat) => {
                  return (
                    <Box key={seat.id}>
                      <Sortable id={seat.id}>
                        <Cell
                          index={seat.index}
                          name={seat.name}
                          visible={seat.visible}
                        />
                      </Sortable>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </SortableContext>
          </DndContext>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
