import { type FC } from 'react';
import { Icon, Stack, StackDivider, VStack } from '@chakra-ui/react';
import { type IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';

type MenuItem = {
  link: string;
  icon?: IconType;
  name: string;
};

type MenuItemProps = {
  items: MenuItem[];
};

const MenuItems: FC<MenuItemProps> = (props) => {
  const { items } = props;

  return (
    <Stack
      spacing={4}
      alignItems="start"
      divider={<StackDivider borderColor="gray.200" />}
    >
      {items.map((item) => {
        return (
          <VStack key={item.link}>
            <NavLink
              to={item.link}
              style={({ isActive, isPending }) => {
                return {
                  fontWeight: isActive ? 'bold' : '',
                  color: isPending ? 'grey' : 'black',
                };
              }}
            >
              <Icon as={item.icon} mr={3} />
              {item.name}
            </NavLink>
          </VStack>
        );
      })}
    </Stack>
  );
};

export { MenuItems, type MenuItem };
