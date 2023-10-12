import { type FC, type CSSProperties, useEffect } from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import { useFormContext } from 'react-hook-form';
import { type LabelData } from './labels';

type LabelColorProps = {
  popover: CSSProperties;
  cover: CSSProperties;
  curColor: string;
  idx: number;
};

const LabelColor: FC<LabelColorProps> = ({ popover, cover, curColor, idx }) => {
  const [color, setColor] = useColor(curColor);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: もっといい方法。
  // 現状だと追加や削除するたびに全部再レンダリングされる
  const methods = useFormContext<LabelData>();
  useEffect(() => {
    methods.setValue(`labels.${idx}.color`, color.hex);

    return () => {
      console.log(`changed! ${color.hex}`);
    };
  }, [color, idx, methods]);

  return (
    <>
      <Button onClick={onOpen} background={color.hex} />
      {isOpen && (
        <Box style={popover}>
          <Box style={cover} onClick={onClose} />
          <ColorPicker
            color={color}
            onChange={setColor}
            hideAlpha={true}
            hideInput={['hsv', "rgb"]}
            height={140}
          />
        </Box>
      )}
    </>
  );
};

export default LabelColor;
