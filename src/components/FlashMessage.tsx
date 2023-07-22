/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-comment-textnodes */
import { useContext } from 'react';
import { FlashContext, FlashContextType } from '../data/FlashProvider';

export default function FlashMessage() {
  const { flashMessage, visible, hideFlash } = useContext(
    FlashContext,
  ) as FlashContextType;
  return (
    <>
      {visible && (
        <div
          role={'alert'}
          data-visible={visible}
          className={`flex justify-between items-center w-6/12 p-4  my-0 mx-auto mb-10 text-${flashMessage.type}-300`}
        >
          <p className={'bg-' + flashMessage.type + '-300'}>
            {flashMessage.message}
          </p>

          <p className="" onClick={hideFlash} onKeyDown={() => null}>
            {' '}
            &times;
          </p>
        </div>
      )}
    </>
  );
}
