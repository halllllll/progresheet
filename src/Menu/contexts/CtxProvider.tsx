import { useEffect, useState, type FC, type ReactNode } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';
import { getSpreadSheetNameAPI, getUserIdAPI } from '../API/MenuDataAPI';
import { MenuCtx } from '../App';

export type CtxType = {
  userID: string;
  sheetName: string;
};

type Props = {
  children?: ReactNode;
};

const CtxProvider: FC<Props> = ({ children }) => {
  const [res, setRes] = useState<CtxType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const f = async () => {
      const [userid, sheetname] = await Promise.all([
        getUserIdAPI(),
        getSpreadSheetNameAPI(),
      ]);
      console.log(`from server! userid = ${userid}`);
      setRes({ userID: userid, sheetName: sheetname });
      setIsLoading(false);
    };
    setIsLoading(true);
    void f();
  }, []);

  return (
    <MenuCtx.Provider value={res}>
      {' '}
      {isLoading ? <ClimbingBoxLoader color="#36d7b7" /> : children}
    </MenuCtx.Provider>
  );
};

export default CtxProvider;
