import { type FC, type CSSProperties } from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

type LabelColorProps = {
  popover: CSSProperties;
  cover: CSSProperties;
  curColor: string;
};

const LabelColor: FC<LabelColorProps> = ({ popover, cover, curColor }) => {
  const [color, setColor] = useColor(curColor);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} background={color.hex} />
      {isOpen && (
        <Box style={popover}>
          <Box style={cover} onClick={onClose} />
          <ColorPicker color={color} onChange={setColor} />
        </Box>
      )}
    </>
  );
};

export default LabelColor;
