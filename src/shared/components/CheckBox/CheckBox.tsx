import clsx from 'clsx';
import React, { useCallback, type ChangeEvent } from 'react';
import style from './CheckBox.module.scss';
import CheckIcon from '@components/icons/CheckIcon';

export type CheckBoxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  onChange: (checked: boolean) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({ onChange, disabled, checked, className, ...rest }) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange(event.target.checked);
    },
    [onChange, disabled]
  );

  return (
    <label
      htmlFor="checkbox"
      className={clsx(style['checkbox'], disabled && style['checkbox_disabled'], className)}
    >
      <input
        {...rest}
        type="checkbox"
        id="checkbox"
        checked={checked}
        disabled={disabled}
        className={style['input']}
        onChange={handleChange}
      />
      {checked && <CheckIcon width={40} height={40} className={clsx(style['checkbox__icon'])} />}
    </label>
  );
};

export default CheckBox;
