import { useUser } from '../data/UserProvider';
import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';

export default function PublicRoute({ children }: { children: ReactElement }) {
  const { user } = useUser();
  console.log(user);
  if (user === undefined) {
    return null;
  } else if (user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}
