import clsx from 'clsx';
import React, { forwardRef, useCallback, type ChangeEvent } from 'react';
import style from './CheckBox.module.scss';
import CheckIcon from '@components/icons/CheckIcon';

export type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  checkSize?: 'normal' | 'small',
}

const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ onChange, disabled, checked, className, checkSize = 'normal', ...rest }, ref) => {
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (!onChange) {
          return;
        }
        onChange(event);
      }, [onChange, disabled]);
      
    return (
      <label
        className={clsx(style['checkbox'], disabled && style['checkbox_disabled'], style[`checkbox_${checkSize}`], className)}
      >
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className={style['input']}
          onChange={handleChange}
        />
        {checked && <CheckIcon width={40} height={40} className={clsx(style['checkbox__icon'])} />}
      </label>
    );
  }
)

CheckBox.displayName = "CheckBox"
export default CheckBox;
