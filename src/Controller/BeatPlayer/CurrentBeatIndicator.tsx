import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import GridElement from '../../GridElement';

import type { Subscriber } from './beatPlayer';

import style from './CurrentBeatIndicator.module.scss';

type Props = {
  subscribe: (fn: Subscriber) => void;
};

export default function CurrentBeatIndicator({ subscribe }: Props) {
  const [beatIndex, setBeatIndex] = useState<number | null>(null);
  const [isValidMeasure, setIsValidMeasure] = useState<boolean>(true);
  useEffect(() => {
    return subscribe((newBeatIndex, newIsValidMeasure) => {
      setBeatIndex(newBeatIndex);
      setIsValidMeasure(newIsValidMeasure);
    });
  }, []);
  return (
    <GridElement
      rowStart={5}
      colStart={beatIndex != null ? beatIndex + 1 : undefined}
      className={cx(
        beatIndex == null ? style.hidden : undefined,
        style.centeredGridElement
      )}
    >
      <div
        className={cx(
          style.dot,
          !isValidMeasure ? style.invalidDot : undefined
        )}
      ></div>
    </GridElement>
  );
}
