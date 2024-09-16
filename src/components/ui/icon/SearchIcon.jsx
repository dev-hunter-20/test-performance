'use client';

import { EIconColor } from '@/common/enums';
import React from 'react';

const SearchIcon = ({ color = EIconColor.WHITE }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 26 23" fill="none">
      <path
        d="M25.2496 0.994263H0.749634C0.612134 0.994263 0.499634 1.10676 0.499634 1.24426V3.24426C0.499634 3.38176 0.612134 3.49426 0.749634 3.49426H25.2496C25.3871 3.49426 25.4996 3.38176 25.4996 3.24426V1.24426C25.4996 1.10676 25.3871 0.994263 25.2496 0.994263ZM25.2496 20.4943H0.749634C0.612134 20.4943 0.499634 20.6068 0.499634 20.7443V22.7443C0.499634 22.8818 0.612134 22.9943 0.749634 22.9943H25.2496C25.3871 22.9943 25.4996 22.8818 25.4996 22.7443V20.7443C25.4996 20.6068 25.3871 20.4943 25.2496 20.4943ZM25.2496 10.7443H0.749634C0.612134 10.7443 0.499634 10.8568 0.499634 10.9943V12.9943C0.499634 13.1318 0.612134 13.2443 0.749634 13.2443H25.2496C25.3871 13.2443 25.4996 13.1318 25.4996 12.9943V10.9943C25.4996 10.8568 25.3871 10.7443 25.2496 10.7443Z"
        fill={color}
      />
    </svg>
  );
};

export default SearchIcon;
