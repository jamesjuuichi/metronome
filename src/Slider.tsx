/*eslint @typescript-eslint/no-use-before-define: ["error", "nofunc"]*/

import React, { useRef, useEffect, memo } from "react";
import cx from "classnames";
import { UNIVERSAL_MAX, UNIVERSAL_MIN } from "./constants";
import { throttle } from "./throttle";

import style from "./Slider.module.scss";

export enum SLIDER_ORIENTATION {
  VERTICAL,
  HORIZONTAL
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
  reportValue
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
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const currentRef = ref.current;

    let isMouseDown = false;

    const getMousePosition = throttle((e: MouseEvent) => {
      /**
       * NOTE: If you want to optimize this, like getBoundingClientRect once
       * on every keydown, then make sure you blocked the scrolling, since getBoundingClientRect gets
       * relative x and y based on scroll position
       */
      const boundingRect = currentRef.getBoundingClientRect();
      if (orientation === SLIDER_ORIENTATION.HORIZONTAL) {
        const offSetX = e.clientX - boundingRect.x + 1;
        reportValue(
          Math.round(
            toRelativeValue(offSetX, 0, boundingRect.width) * (max - min + 1)
          )
        );
      } else {
        const offSetY = e.clientY - boundingRect.y + 1;
        reportValue(
          Math.round(
            toRelativeValue(
              boundingRect.height - offSetY,
              0,
              boundingRect.height
            ) *
              (max - min + 1)
          )
        );
      }
    }, 50);

    function mouseDownEvent(e: MouseEvent) {
      isMouseDown = true;
      getMousePosition(e);
    }
    function mouseUpEvent(e: MouseEvent) {
      isMouseDown = false;
    }
    function mouseMoveEvent(e: MouseEvent) {
      if (!isMouseDown) {
        return;
      }
      getMousePosition(e);
    }

    currentRef.addEventListener("mousedown", mouseDownEvent);
    currentRef.addEventListener("mousemove", mouseMoveEvent);
    currentRef.addEventListener("mouseup", mouseUpEvent);
    currentRef.addEventListener("mouseleave", mouseUpEvent);

    return () => {
      currentRef.removeEventListener("mousedown", mouseDownEvent);
      currentRef.removeEventListener("mousemove", mouseMoveEvent);
      currentRef.removeEventListener("mouseup", mouseUpEvent);
      currentRef.removeEventListener("mouseleave", mouseUpEvent);
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
      width: `${percentage}%`
    };
  }
  return {
    height: `${percentage}%`
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
