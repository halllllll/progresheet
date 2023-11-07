import { type FC, useCallback, useRef, useState } from 'react';
import { Box, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  rectSwappingStrategy,
  arraySwap,
} from '@dnd-kit/sortable';

import { type SeatLayoutData } from '../../SeatForm';
import { useDndSensors } from '../hooks/hook';
import Cell from './Cell';
import CellModal from './CellModal';
import Sortable from './Sortable';
import { type SeatDTO } from '@/Menu/types';

type Props = {
  layout: SeatLayoutData;
  columnCount: number;
  updateLayoutHandler?: (data: SeatLayoutData) => void;
  editHandler: (index: number, data: SeatDTO) => void;
  hookFormSwap: (indexA: number, indexB: number) => void;
};

const Layout: FC<Props> = ({
  layout,
  columnCount,
  updateLayoutHandler,
  editHandler,
  hookFormSwap,
}) => {
  //  drag 終了時に発火するハンドラ
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over === null || active.id === over.id) return;

      const oldIndex = layout.findIndex((field) => field.id === active.id);
      const newIndex = layout.findIndex((field) => field.id === over.id);
      const newStates = arraySwap(layout, oldIndex, newIndex);
      if (updateLayoutHandler !== undefined) {
        hookFormSwap(oldIndex, newIndex);
        updateLayoutHandler(newStates);
      }
    },

    [hookFormSwap, layout, updateLayoutHandler]
  );

  const {
    isOpen: isCellModalOpen,
    onOpen: onCellModalOpen,
    onClose: onCellModalClose,
  } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [targetSeat, setTargetSeat] = useState<{
    seat: SeatDTO;
    orderIndex: number;
  } | null>(null);
  const openCellModal = (selectedSeat: SeatDTO, orderIndex: number): void => {
    setTargetSeat({ seat: selectedSeat, orderIndex });
    onCellModalOpen();
  };

  // sensorの定義。
  const sensors = useDndSensors();

  return (
    <Box>
      {isCellModalOpen /** TODO: isOpenを判定に使うの卑怯 useStateのデフォルトがNullである・でないときのフィルタリングをちゃんとしたい、あるいは現在の設計がイケてない */ && (
        <CellModal
          onOpen={onCellModalOpen}
          isOpen={isCellModalOpen}
          onClose={onCellModalClose}
          seatData={targetSeat}
          updater={editHandler}
          initialRef={initialRef}
          finalRef={finalRef}
        />
      )}

      <Box maxH={'md'} maxW={'lg'} overflow={'scroll'} border={'1px'}>
        <Box w="max-content">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={layout} strategy={rectSwappingStrategy}>
              <SimpleGrid spacing={'4px'} columns={columnCount}>
                {layout.map((seat, orderIdx) => {
                  return (
                    // ** uuid
                    <Box key={seat.id}>
                      {/** ** uuid */}
                      <Sortable id={seat.id}>
                        <Box
                          onClick={() => {
                            // なんかこれがだめらしい
                            const curSeat: SeatDTO = {
                              index: seat.index,
                              name: seat.name,
                              visible: seat.visible,
                            };
                            openCellModal(curSeat, orderIdx);
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
