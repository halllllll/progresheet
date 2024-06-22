import { type Dispatch, useContext } from 'react';
import { MenuCtx, SetMenuCtx } from '../App';
import { ContextError } from '../errors';
import { type CtxType } from './CtxProvider';

// menuCts, setMenuCtx hook
export const useAppMenuCtx = (
  becon?: string
): {
  menuCtx: CtxType;
  setMenuCtx: Dispatch<React.SetStateAction<CtxType | null>>;
} => {
  const menuCtx = useContext(MenuCtx);
  const setMenuCtx = useContext(SetMenuCtx);

  if (!menuCtx) throw new ContextError('non-context error', { details: becon });

  return { menuCtx, setMenuCtx };
};
