import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MeType } from './user';
import { useApi } from './ApiProvider';

interface UserType {
  user: MeType | null;
  logout: () => void;
  login: (email: string, password: string) => Promise<string>;
  setUser: Dispatch<SetStateAction<MeType | null>>;
}
const UserContext = createContext<UserType | null>(null);
export default function UserProvider({ children }: any) {
  const [user, setUser] = useState<MeType | null>(null);
  const api = useApi();

  useEffect(() => {
    void (async () => {
      if (api.isAuthenticated()) {
        const res = await api.get<MeType>('/users/me');

        if (res.ok) {
          setUser(res.body);
        }
      }
    })();
  }, [api]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email, password);

      if (res === 'ok') {
        const result = await api.get<MeType>('/users/me');
        if (result.ok) {
          setUser(result.body);
        }
      }
      return res;
    },
    [api],
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, [api]);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext) as UserType;
};
