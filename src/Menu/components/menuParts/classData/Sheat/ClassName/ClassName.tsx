import { useRef, type FC } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import ClassNameBtn from './ClassNameBtn';
import ClassNameModal from './ClassNameModal';
import { type ClassLayout } from '@/Menu/types';

type Props = {
  name: string;
  menuClassLayoutCtxUpdater: (data: Partial<ClassLayout>) => void;
};
const ClassName: FC<Props> = ({ name }) => {
  const {
    isOpen: isClassNameModalOpen,
    onOpen: onClassNameModalOpen,
    onClose: onClassNameModalClose,
  } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <>
      {Boolean(isClassNameModalOpen) && (
        <ClassNameModal
          onOpen={onClassNameModalOpen}
          isOpen={isClassNameModalOpen}
          onClose={onClassNameModalClose}
          initialRef={initialRef}
          finalRef={finalRef}
        />
      )}
      <ClassNameBtn
        name={name}
        onOpen={onClassNameModalOpen}
        isOpen={isClassNameModalOpen}
      />
    </>
  );
};

export default ClassName;
