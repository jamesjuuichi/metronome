import React, { useRef, useEffect, memo } from 'react';
import cx from 'classnames';
import { UNIVERSAL_MAX, UNIVERSAL_MIN } from './constants';
import { throttle } from './throttle';

import style from './Slider.module.scss';

export enum SLIDER_ORIENTATION {
  VERTICAL,
  HORIZONTAL,
}

type Props = {
  value: number;
  min?: number;
  max?: number;
  width?: string;
  orientation?: SLIDER_ORIENTATION;
  reportValue: (value: number) => void;
};

function SynthesizedSlider({
  value,
  min = UNIVERSAL_MIN,
  max = UNIVERSAL_MAX,
  orientation = SLIDER_ORIENTATION.HORIZONTAL,
  reportValue,
}: Props) {
  const fillerStyle = useFillerStyle(value, min, max, orientation);
  const ref = useSliderInteraction(reportValue, min, max, orientation);

  return (
    <div
      ref={ref}
      className={cx(
        style.slider,
        orientation === SLIDER_ORIENTATION.VERTICAL ? style.vertical : undefined
      )}
    >
      <div className={style.filled} style={fillerStyle}></div>
    </div>
  );
}

export default memo(SynthesizedSlider);

function useSliderInteraction(
  reportValue: (newValue: number) => void,
  min: number,
  max: number,
  orientation: SLIDER_ORIENTATION
) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const currentRef = ref.current;

    let isMouseDown = false;

    const getMousePosition = throttle((e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('changedTouches' in e) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      /**
       * NOTE: If you want to optimize this, like getBoundingClientRect once
       * on every keydown, then make sure you blocked the scrolling, since getBoundingClientRect gets
       * relative x and y based on scroll position
       */
      const boundingRect = currentRef.getBoundingClientRect();
      if (orientation === SLIDER_ORIENTATION.HORIZONTAL) {
        const offSetX = clientX - boundingRect.x + 1;
        reportValue(
          min +
            Math.round(
              toRelativeValue(offSetX, 0, boundingRect.width) * (max - min)
            )
        );
      } else {
        const offSetY = clientY - boundingRect.y + 1;
        reportValue(
          min +
            Math.round(
              toRelativeValue(
                boundingRect.height - offSetY,
                0,
                boundingRect.height
              ) *
                (max - min)
            )
        );
      }
    }, 50);

    function mouseDownEvent(e: MouseEvent) {
      e.preventDefault();
      isMouseDown = true;
      getMousePosition(e);

      window.addEventListener('mousemove', mouseMoveEvent);
      window.addEventListener('touchmove', mouseMoveEvent);
      window.addEventListener('touchend', mouseUpEvent);
      window.addEventListener('mouseup', mouseUpEvent);
    }
    function mouseUpEvent(e: MouseEvent) {
      e.preventDefault();
      isMouseDown = false;

      window.removeEventListener('mousemove', mouseMoveEvent);
      window.removeEventListener('touchmove', mouseMoveEvent);
      window.removeEventListener('touchend', mouseUpEvent);
      window.removeEventListener('mouseup', mouseUpEvent);
    }
    function mouseMoveEvent(e: MouseEvent) {
      e.preventDefault();
      if (!isMouseDown) {
        return;
      }
      getMousePosition(e);
    }

    currentRef.addEventListener('mousedown', mouseDownEvent);
    currentRef.addEventListener('touchstart', mouseDownEvent);

    return () => {
      currentRef.removeEventListener('mousedown', mouseDownEvent);
      currentRef.removeEventListener('touchstart', mouseDownEvent);
    };
  }, [min, max, orientation, reportValue]);

  return ref;
}

function useFillerStyle(
  value: number,
  min: number,
  max: number,
  orientation: SLIDER_ORIENTATION
): React.CSSProperties {
  const percentage = toPercentageValue(value, min, max);
  if (orientation === SLIDER_ORIENTATION.HORIZONTAL) {
    return {
      width: `${percentage}%`,
    };
  }
  return {
    height: `${percentage}%`,
  };
}

function toRelativeValue(value: number, min: number, max: number) {
  if (value < min) {
    return 0;
  }
  if (value > max) {
    return 1;
  }
  return (value - min) / (max - min);
}

function toPercentageValue(value: number, min: number, max: number) {
  return toRelativeValue(value, min, max) * 100;
}
