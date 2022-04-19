import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const portalNode = document.querySelector('#portal');

export function usePortal(node: React.ReactNode) {
  const divRef = useRef<HTMLDivElement>(document.createElement('div'));

  useEffect(() => {
    if (!portalNode) {
      return;
    }
    portalNode.appendChild(divRef.current);
    return () => {
      portalNode.removeChild(divRef.current);
    };
  }, []);

  return [divRef, ReactDOM.createPortal(node, divRef.current)] as const;
}
