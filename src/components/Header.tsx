import { Link } from 'react-router-dom';
import { useUser } from '../data/UserProvider';

export default function Header() {
  const { user, logout } = useUser();

  console.log(user);

  return (
    <header className={'w-full flex flex-row justify-between p-4 '}>
      <p className={'text-xl hover:text-blue-600'}>
        <Link to="/">KnowRit</Link>{' '}
      </p>
      <nav className="navbar">
        {user === undefined ? (
          <p>Loading</p>
        ) : user === null ? (
          <div>
            {/* <button className="mx-2 hover:text-blue-600">
                            <Link to='/login'>Login</Link></button>
                        <button className="bg-black p-2 text-white mx-2 hover:text-yellow-600">
                            <Link to='/signup'>Signup</Link></button> */}
          </div>
        ) : (
          <>
            {user !== null && (
              <>
                <div className="dropdown h-full">
                  <Link
                    to={'/users/' + String(user.user.username)}
                    className={'mx-2 hover:text-blue-600'}
                  >
                    {user.user.username}
                  </Link>
                  &nbsp;
                  <Link
                    to="/"
                    onClick={logout}
                    className={
                      'bg-black p-2 text-white mx-2 hover:text-yellow-600'
                    }
                  >
                    Logout
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
}
