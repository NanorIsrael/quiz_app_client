import { ReactElement, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
// import "../index.css";

interface IModal {
  xtraclass: string;
  children: ReactElement;
}
export const Modal: React.FC<IModal> = ({ children, xtraclass }) => {
  const modalref = useRef<HTMLDivElement>();

  if (!modalref.current) {
    modalref.current = document.createElement('div');
  }

  useEffect(() => {
    const modalRoot = document.getElementById('modal');
    if (!modalRoot || !modalref.current) {
      return;
    }
    modalRoot.appendChild(modalref.current);

    return () => {
      if (modalRoot && modalref.current) {
        modalRoot.removeChild(modalref.current);
      }
    };
  }, []);
  return createPortal(
    <section className={'p-0 m-0 modal ' + xtraclass}>{children}</section>,
    modalref.current,
  );
};
