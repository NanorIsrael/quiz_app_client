import { MutableRefObject } from 'react';

export type ErrorType = {
  [key: string]: string;
};

type InputType = {
  name: string;
  label?: boolean;
  type?: string;
  errors?: ErrorType;
  fieldRef?: MutableRefObject<HTMLInputElement>;
};
export default function InputField({
  name,
  label,
  type,
  errors,
  fieldRef,
}: InputType) {
  return (
    <div className="p-1 flex flex-col mb-5">
      {label ? (
        <label
          htmlFor={name}
          className="flex flex-col justify-stary items-start"
        >
          {name}
          <input
            id={name}
            type={type || 'text'}
            placeholder={name}
            ref={fieldRef}
          />
        </label>
      ) : (
        <input
          id={name}
          type={type || 'text'}
          placeholder={name}
          ref={fieldRef}
        />
      )}
      {errors && (
        <p className={`text-red-600 text-sm bold ${name}`}>{errors[name]}</p>
      )}
    </div>
  );
}
