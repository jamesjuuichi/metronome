import React, { useRef, useEffect } from 'react';

import { createMessageQueue } from './messageQueue';
import { randomRange } from '../randomRange';

import style from './style.module.scss';

const SHOW_MESSAGE_CLICKING_THREADHOLD = 10;
const CLICK_SAMPLING_TIME_FRAME = 10000;
const MESSAGE_BOUNDARY_VERTICAL = 100;
const MESSAGE_BOUNDARY_HORIZONTAL = 100;

export default function Background() {
  const clickCountRef = useRef<number>(0);
  const messageQueueRef = useRef<ReturnType<typeof createMessageQueue>>(
    createMessageQueue()
  );
  const ref = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !messageRef.current) {
      return;
    }
    const currentRef = ref.current;
    const currentMessageRef = messageRef.current;

    let isAnimating = false;
    function showHintMessage() {
      isAnimating = true;
      currentMessageRef.style.display = 'none';
      currentMessageRef.style.top = `${randomRange(
        MESSAGE_BOUNDARY_VERTICAL,
        window.innerHeight
      )}px`;
      currentMessageRef.style.left = `${randomRange(
        0,
        window.innerWidth - MESSAGE_BOUNDARY_HORIZONTAL
      )}px`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          currentMessageRef.innerText = messageQueueRef.current.nextMessage();
          currentMessageRef.style.display = 'block';
          isAnimating = false;
        });
      });
    }

    function clickHandler() {
      if (isAnimating) {
        return;
      }
      clickCountRef.current =
        (clickCountRef.current + 1) % SHOW_MESSAGE_CLICKING_THREADHOLD;
      if (clickCountRef.current === 0) {
        showHintMessage();
      }
    }
    currentRef.addEventListener('click', clickHandler);

    return () => {
      currentRef.removeEventListener('click', clickHandler);
    };
  }, []);

  useEffect(() => {
    const intervalToClearSampling = setInterval(() => {
      clickCountRef.current = 0;
    }, CLICK_SAMPLING_TIME_FRAME);
    return () => {
      clearInterval(intervalToClearSampling);
    };
  }, []);
  return (
    <div ref={ref} className={style.background}>
      <div ref={messageRef} className={style.message}></div>
    </div>
  );
}
