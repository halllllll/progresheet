import { type FC, useCallback, useRef, useState } from 'react';
import { Box, SimpleGrid, useDisclosure } from '@chakra-ui/react';
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
import CellModal from './CellModal';
import Sortable from './Sortable';
import { type Seat } from '@/Menu/types';

type Props = {
  layout: SeatLayoutData;
  columnCount: number;
  setLayoutHandler?: (data: SeatLayoutData) => void;
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
        if (setLayoutHandler !== undefined) setLayoutHandler(newStates);
      }
    },
    [layout, setLayoutHandler]
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [targetSeat, setTargetSeat] = useState<Seat | null>(null);
  const onCellModalOpen = (selectedSeat: Seat): void => {
    setTargetSeat(selectedSeat);
    onOpen();
  };

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
    <Box>
      {isOpen /** TODO: isOpenを判定に使うの卑怯 useStateのデフォルトがNullである・でないときのフィルタリングをちゃんとしたい、あるいは現在の設計がイケてない */ && (
        <CellModal
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onClose}
          seat={targetSeat}
          initialRef={initialRef}
          finalRef={finalRef}
        />
      )}

      <Box maxH={'md'} maxW={'lg'} overflow={'scroll'} border={'1px'}>
        <Box w="max-content">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={layout} strategy={rectSwappingStrategy}>
              <SimpleGrid spacing={'4px'} columns={columnCount}>
                {layout.map((seat) => {
                  return (
                    <Box key={seat.id}>
                      <Sortable id={seat.id}>
                        <Box
                          onClick={() => {
                            // なんかこれがだめらしい
                            const curSeat: Seat = {
                              index: seat.index,
                              name: seat.name,
                              visible: seat.visible,
                            };
                            onCellModalOpen(curSeat);
                          }}
                        >
                          <Cell
                            index={seat.index}
                            name={seat.name}
                            visible={seat.visible}
                          />
                        </Box>
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
