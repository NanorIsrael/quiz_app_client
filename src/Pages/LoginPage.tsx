/* eslint-disable @typescript-eslint/no-misused-promises */
import { MutableRefObject, useEffect } from 'react';
import { SyntheticEvent, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { useUser } from '../data/UserProvider';
import { ErrorType } from '../data/user';
import { Modal } from '../components/Modal';

export default function LoginPage() {
  const [formErrors, setFormErrors] = useState<ErrorType>({});
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passRef = useRef() as MutableRefObject<HTMLInputElement>;
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => usernameRef.current?.focus(), []);

  const onSubmit = async (ev: SyntheticEvent) => {
    ev.preventDefault();

    const email = usernameRef.current?.value;
    const password = passRef.current?.value;

    let errors: ErrorType = {};
    if (!email) {
      errors.email = 'email field can not be empty';
    }
    if (!password) {
      errors.password = 'password field can not be empty';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (email && password) {
      const result: string = await user?.login(email, password);
      if (result === 'fail') {
        errors = {};

        // flash && flash('Invalid username or password', 'red')
        errors.password = 'email and password dont match';
        setFormErrors(errors);
      } else if (result === 'ok') {
        let next = '/';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (location.state && location?.state.next) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          next = location.state.next as string;
        }
        navigate(next);
      }
    }
  };

  return (
    <Modal xtraclass={'bg-gray-200'}>
      <>
        <h1 className="header">Login here</h1>
        <form onSubmit={onSubmit}>
          <InputField
            label
            type="email"
            name={'email'}
            fieldRef={usernameRef}
            errors={formErrors}
          />
          <InputField
            label
            type={'password'}
            name={'password'}
            fieldRef={passRef}
            errors={formErrors}
          />
          <button
            type={'submit'}
            className={
              'w-full mb-5 rounded px-6 py-2 color text-white hover:opacity-50 border-none bg-orange-500'
            }
          >
            submit
          </button>
        </form>
        <hr />
        <p>
          Don&#39;t have an account?{' '}
          <Link to="/signup" className="underline text-orange-600">
            Register here
          </Link>
        </p>
      </>
    </Modal>
  );
}
