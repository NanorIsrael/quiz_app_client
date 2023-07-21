import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import Client, { QuizAPIClient } from '../clients/QuizClient';
import { useFlash } from './FlashProvider';

const ApiContext = createContext<QuizAPIClient | null>(null);
export default function ApiProvider({ children }: { children: ReactElement }) {
  const flash = useFlash();

  const onError = useCallback(() => {
    flash &&
      flash('An tunexpected error has occured, Please try again.', 'danger');
  }, [flash]);

  const api = useMemo(() => new Client(onError), [onError]);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export const useApi = () => {
  return useContext(ApiContext) as QuizAPIClient;
};
