import { createContext, type FC } from 'react';
import { type CtxType } from './contexts/CtxProvider';

import Providers from './providers';

// define global context on top
export const MenuCtx = createContext<CtxType | null>(null);

const App: FC = () => {
  return <Providers />;
};

export default App;
