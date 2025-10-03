import clsx from 'clsx';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import style from './MultiDropdown.module.scss';
import { InputValueAdapter } from '@components/Input';
import ArrowDownIcon from '@components/icons/ArrowDownIcon';
import { Option } from '@model/option-dropdown';

export type DropdownProps = {
  className?: string;
  options: Option[];
  inputValue: string;
  selected: Option[];
  onChange: (value: Option) => void;
  onInput?: (Value: string) => void;
  disabled?: boolean;
  placeholder?: string
};

const isElement = (target: EventTarget | null): target is Element => {
  return target instanceof Element;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onInput,
  inputValue,
  selected,
  onChange,
  disabled,
  className,
  placeholder
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isShowDropdown, setIsShowDropdown] = useState(false);

  const handleInputClick = useCallback(() => {
    if (!disabled && !isShowDropdown) {
      setIsShowDropdown(true);
    }
  }, [disabled, isShowDropdown]);

  const handleInputValue = useCallback((value: string) => {
    if(onInput) {
      onInput(value)
    }
  }, [onInput])

  const handleOptionClick = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    const id = event.currentTarget.dataset.id;
    const currentOptions = options.find(item => item.key === id)
    if(currentOptions) {
      onChange(currentOptions)
    }
  },  [options, onChange]);

  const handleClickOutside = useCallback((event: MouseEvent) => {  
    const target = event.target;
    if(!isElement(target)) {
      return;
    }

    if (containerRef.current?.contains(target) && target.closest('li')) {
      return;
    }

    if(containerRef.current && !containerRef.current.contains(target)) {
      setIsShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={containerRef} className={clsx(style['dropdown-container'], className)}>
      <InputValueAdapter
        disabled={disabled}
        onChange={handleInputValue}
        value={inputValue}
        ref={inputRef}
        afterSlot={<ArrowDownIcon color="secondary" />}
        placeholder={placeholder}
        name="multiDropdownInput"
        onClick={handleInputClick}
      />
      {isShowDropdown && !disabled && (
        <ul className={clsx(style['dropdown'])}>
          {options
            .filter((item) => item.value.toLowerCase().includes(inputValue.toLowerCase()))
            .map((option) => (
              <li
                data-id={option.key}
                onClick={handleOptionClick}
                key={option.key}
                className={clsx(
                  style['dropdown__option'],
                  selected.find((item) => item.key === option.key) && style['dropdown__option_selected']
                )}
              >
                {option.value}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
