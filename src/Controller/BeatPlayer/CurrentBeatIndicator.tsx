import React, { useState, useEffect } from 'react';
import cx from 'classnames';

import GridElement from '../../GridElement';

import type { Subscriber } from './beatPlayer';

import style from './CurrentBeatIndicator.module.scss';
import gridStyle from '../style.module.scss';

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
      className={cx(
        beatIndex == null ? style.hidden : undefined,
        style.centeredGridElement,
        beatIndex == null ? undefined : gridStyle[`indicator${beatIndex + 1}`]
      )}
      skipStyling={true}
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
