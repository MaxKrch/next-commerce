import clsx from 'clsx';
import React, { type ChangeEvent } from 'react';

import style from './Input.module.scss';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onChange: (value: string) => void;
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, afterSlot, className, ...rest }, ref) => {
    return (
      <div className={clsx(style['input-container'], className)}>
        <input
          {...rest}
          className={clsx(style['input'], afterSlot && style['input_with-icon'])}
          ref={ref}
          type="text"
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        />
        {afterSlot && <div className={clsx(style['input__icon-container'])}>{afterSlot}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input'
export default Input;
