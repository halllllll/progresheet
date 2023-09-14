import { type FC, createContext, useEffect, useState } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';
import { serverFunctions } from './API/serverFnctions';
import Parent from './components/Parent';

type CtxType = {
  userID: string;
  sheetName: string;
};
export const MyCtx = createContext<CtxType | null>(null);

const App: FC = () => {
  const [res, setRes] = useState<CtxType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const isMounted = false;
    const f = async () => {
      if (!isMounted) {
        const [userid, sheetname] = await Promise.all([
          serverFunctions.getId(),
          serverFunctions.getSpreadSheetName(),
        ]);
        console.log(`from server! userid = ${userid}`);
        setRes({ userID: userid, sheetName: sheetname });
        setIsLoading(false);
      }
    };
    setIsLoading(true);
    void f();
  }, []);

  return (
    <>
      <MyCtx.Provider value={res}>
        {isLoading ? (
          <ClimbingBoxLoader color="#36d7b7" />
        ) : (
          <>
            <h1>メニューだよ</h1>
            <div>わ〜い</div>
            <Parent />
          </>
        )}
      </MyCtx.Provider>
    </>
  );
};

export default App;
