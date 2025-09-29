import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import style from './MultiDropdown.module.scss';
import Input from '@components/Input';
import ArrowDownIcon from '@components/icons/ArrowDownIcon';
import { Option } from '@model/option-dropdown';

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};

const isNode = (element: EventTarget | null): element is Node => {
  return element !== null && element instanceof Node;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  value,
  onChange,
  disabled,
  getTitle,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const title = useMemo(() => getTitle(value), [value, getTitle]);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [inputValue, setInputvalue] = useState(value.length > 0 ? title : '');

  const stateRef = useRef({
    options,
    value,
    disabled,
    isShowDropdown,
    inputValue,
    title,
  });

  useEffect(() => {
    stateRef.current = {
      options,
      value,
      disabled,
      isShowDropdown,
      inputValue,
      title,
    };
  }, [options, value, disabled, isShowDropdown, inputValue, title]);

  const handleInputClick = useCallback(() => {
    if (!disabled && !isShowDropdown) {
      setIsShowDropdown(true);
    }
  }, [disabled, isShowDropdown]);

  const handleOptionClick = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    const id = event.currentTarget.dataset.id;
    const isSelected = value.findIndex(item => item.key === id) > -1;

    if (isSelected) {
      onChange(value.filter(item => item.key !== id));
      return;
    } 
    
    const targetOption = options.find(item => item.key === id);
    if (targetOption) {
      onChange([...value, targetOption]);
    }
  },  [value, options, onChange]);

  const handleClickOutside = useCallback((event: MouseEvent) => {  
    const target = event.target;
    
    if(!isNode(target)) {
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


  useEffect(() => {
    if (isShowDropdown || stateRef.current.value.length === 0) {
      setInputvalue('');
    } else {
      setInputvalue(title);
    }
  }, [isShowDropdown, title]);



  return (
    <div ref={containerRef} className={clsx(style['dropdown-container'], className)}>
      <Input
        disabled={disabled}
        onChange={setInputvalue}
        value={inputValue}
        ref={inputRef}
        afterSlot={<ArrowDownIcon color="secondary" />}
        placeholder={title}
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
                  value.find((value) => value.key === option.key) && style['dropdown__option_selected']
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

export default MultiDropdown;
