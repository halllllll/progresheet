import { type FC, useEffect } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';
import { serverFunctions } from './API/serverFnctions';

const App: FC = () => {
  useEffect(() => {
    const f = async () => {
      const userid = await serverFunctions.getId();
      console.log(`from server! userid = ${userid}`);
    };
    void f();
  }, []);

  return (
    <>
      <h1>メニューだよ</h1>
      <div>わ〜い</div>
      <ClimbingBoxLoader color="#36d7b7" />
    </>
  );
};

export default App;
