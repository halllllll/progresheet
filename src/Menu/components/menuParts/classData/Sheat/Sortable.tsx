import { type ReactNode, type FC } from 'react';
import { Box } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  children?: ReactNode;
  id: string;
};

export const Sortable: FC<Props> = ({ children, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      animateLayoutChanges: () => false,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: 'none', // TODO: unknown behavior
  };

  return (
    <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </Box>
  );
};

export default Sortable;
