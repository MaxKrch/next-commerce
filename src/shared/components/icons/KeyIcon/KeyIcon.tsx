import React from 'react';

import Icon, { type IconProps } from '../Icon';

const KeyIcon: React.FC<IconProps> = ({ width = 24, height = 24, ...rest }) => {
  return (
    <Icon {...rest} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <circle 
        cx="7.5" 
        cy="8" 
        r="4.2"
        stroke="currentColor" 
        stroke-width="1.6"
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"
      />
      <path 
        d="M10.5 11 L21 21.5"
        stroke="currentColor" 
        stroke-width="1.6"
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"
      />
      <path 
        d="M18.5 19 l2.5 2.5 m-1.3-3.8 l2.5 2.5"
        stroke="currentColor" 
        stroke-width="1.6"
        stroke-linecap="round" 
        stroke-linejoin="round" 
        fill="none"
      />
    </Icon>
  );
};

export default KeyIcon;
