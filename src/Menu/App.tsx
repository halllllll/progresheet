import { type FC, createContext, useEffect, useState } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';
import { serverFunctions } from './API/serverFnctions';
import Parent from './components/Parent';

type CtxType = {
  userID: string;
};
export const MyCtx = createContext<CtxType | null>(null);

const App: FC = () => {
  const [res, setRes] = useState<CtxType | null>(null);
  useEffect(() => {
    const f = async () => {
      const userid = await serverFunctions.getId();
      console.log(`from server! userid = ${userid}`);
      setRes({ userID: userid });
    };
    void f();
  }, []);

  return (
    <>
      <MyCtx.Provider value={res}>
        <h1>メニューだよ</h1>
        <div>わ〜い</div>
        <Parent />
      </MyCtx.Provider>
    </>
  );
};

export default App;
