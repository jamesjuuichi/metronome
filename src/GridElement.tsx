import React from 'react';
import cx from 'classnames';

import style from './GridElement.module.css';

type GridElementType = {
  colStart?: number;
  colSpan?: number;
  rowStart?: number;
  rowSpan?: number;
  skipStyling?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function GridElement({
  colStart = 1,
  colSpan = 1,
  rowStart = 1,
  rowSpan = 1,
  skipStyling = false,
  className,
  children,
}: GridElementType) {
  const styling = skipStyling
    ? {}
    : {
        gridRowStart: rowStart,
        gridRowEnd: rowStart + rowSpan,
        gridColumnStart: colStart,
        gridColumnEnd: colStart + colSpan,
      };
  return (
    <div style={styling} className={cx(style.relativeBox, className)}>
      {children}
    </div>
  );
}
