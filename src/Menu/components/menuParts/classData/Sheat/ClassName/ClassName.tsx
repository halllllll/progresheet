import { useRef, type FC, useState, type ChangeEvent } from 'react';
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
  const [className, setClassName] = useState<string>(name);
  const setNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
    console.warn(className);
  };

  return (
    <>
      {Boolean(isClassNameModalOpen) && (
        <ClassNameModal
          onOpen={onClassNameModalOpen}
          isOpen={isClassNameModalOpen}
          onClose={onClassNameModalClose}
          initialRef={initialRef}
          finalRef={finalRef}
          name={className}
          setNameHandler={setNameHandler}
        />
      )}
      <ClassNameBtn
        name={className}
        onOpen={onClassNameModalOpen}
        isOpen={isClassNameModalOpen}
      />
    </>
  );
};

export default ClassName;
