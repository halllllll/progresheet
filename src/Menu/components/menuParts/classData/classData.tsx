import { type FC, useContext } from 'react';
import { Box, HStack, Heading, Text, Tooltip } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { RiInformationFill } from 'react-icons/ri';
import { MenuCtx, SetMenuCtx } from '@/Menu/App';
import GetClassData from './GetClassDataButton';
import SeatForm from './SeatForm';
import { ClassLayoutSchema } from './Sheat/SheatLayout/schema';
import { ContextError } from '@/Menu/errors';
import { type ClassLayout } from '@/Menu/types';

const ClassData: FC = () => {
  const menuCtx = useContext(MenuCtx);
  const setMenuCtx = useContext(SetMenuCtx);

  if (menuCtx === null)
    throw new ContextError('non-context error', { details: 'on EditorsForm' });

  // updater
  const menuClassLayoutCtxUpdater = (data: Partial<ClassLayout>) => {
    if (!menuCtx.classLayout) throw new ContextError('non-context error');
    const newClassLayout: ClassLayout = {
      name: data.name ?? menuCtx.classLayout.name,
      row: data.row ?? menuCtx.classLayout.row,
      column: data.column ?? menuCtx.classLayout.column,
      seats: data.seats ?? menuCtx.classLayout.seats,
    };
    setMenuCtx({
      ...menuCtx,
      classLayout: { ...newClassLayout },
    });
  };

  const methods = useForm<ClassLayout>({
    mode: 'all',
    criteriaMode: 'all',
    shouldFocusError: true,
    defaultValues: {
      column: menuCtx.classLayout?.column,
      row: menuCtx.classLayout?.row,
      name: menuCtx.classLayout?.name,
      seats: menuCtx.classLayout?.seats,
    },
    resolver: yupResolver(ClassLayoutSchema),
  });

  return (
    <Box>
      <Heading variant="h2" size="lg">
        {'クラス作成'}
      </Heading>
      <Box py={5}>
        <HStack>
          <Text>{'クラス名簿と座席を作成します（設定UIはβ版）'}</Text>
          <Tooltip
            label={
              '編集ではなく、新規作成です。現在の状態を反映・更新するのではなく、新しく生成されます。'
            }
            fontSize="lg"
            placement="top"
            p={3}
            hasArrow
          >
            <Text>
              <RiInformationFill />
            </Text>
          </Tooltip>
        </HStack>
      </Box>
      <Box py={5}>
        <FormProvider {...methods}>
          {menuCtx.classLayout === undefined ||
          menuCtx.classLayout.seats.length === 0 ? (
            <>
              <GetClassData />
            </>
          ) : (
            <>
              <SeatForm
                // TODO: 変換が多くて怖い
                defaultColumnCount={parseInt(
                  menuCtx.classLayout.column.toString()
                )}
                menuClassLayoutCtxUpdater={menuClassLayoutCtxUpdater}
              />
            </>
          )}
        </FormProvider>
      </Box>
    </Box>
  );
};

export default ClassData;
