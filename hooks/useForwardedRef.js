import { useRef, useEffect } from 'react';

export default function useForwardedRef(ref) {
  const innerRef = useRef(null);

  useEffect(() => {
    if (!ref)
      return;

    if (typeof ref === 'function') {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}