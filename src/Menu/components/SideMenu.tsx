import { type FC } from 'react';
import { Box } from '@chakra-ui/react';
import { FaSchool } from 'react-icons/fa';
import { LuCog } from 'react-icons/lu';
import { PiSealWarningFill } from 'react-icons/pi';
import { RiParentLine } from 'react-icons/ri';
import { type MenuItem, MenuItems } from './menuParts/menuItems';

export const SideMenu: FC = () => {
  const sideMenuItems: MenuItem[] = [
    {
      link: `init`,
      icon: PiSealWarningFill,
      name: '初期化',
    },
    {
      link: `labels`,
      icon: RiParentLine,
      name: 'ラベル設定',
    },
    {
      link: `class_data`,
      icon: FaSchool,
      name: 'クラス設定',
    },
    {
      link: `info`,
      icon: LuCog,
      name: '情報',
    },
  ];

  return (
    <Box w="full" m="20px">
      <MenuItems items={sideMenuItems} />
    </Box>
  );
};
