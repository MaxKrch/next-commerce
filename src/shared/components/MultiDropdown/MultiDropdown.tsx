import React, { useCallback, useMemo, useState } from 'react';
import { Option } from '@model/option-dropdown';
import Dropdown from '@components/Dropdown';

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  selectedOptions: Option[];
  onSelect: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  selectedOptions,
  onSelect,
  disabled,
  getTitle,
  className,
}) => {
  const handleSelect = useCallback((option: Option) => {
    const isSelected = selectedOptions.includes(option);

    if (isSelected) {
      onSelect(selectedOptions.filter(item => item.key !== option.key));
      return;
    } 
    
    const isCorrectOption = options.includes(option);
    if (isCorrectOption) {
      onSelect([...selectedOptions, option]);
    }
  },  [selectedOptions, options, onSelect]);

  return (
    <Dropdown 
      options={options}
      selected={selectedOptions}
      onSelect={handleSelect}
      disabled={disabled}
      className={className}
      getTitle={getTitle}
      mode='multi'
    />
  );
};

export default MultiDropdown;
