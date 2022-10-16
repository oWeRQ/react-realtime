import { useEffect, useRef } from 'react';

export default function useClickOutside(ref, onClick) {
  const onClickRef = useRef();
  onClickRef.current = onClick;
  useEffect(() => {
    const listener = e => {
      if (ref?.current && !ref.current.contains(e.target)) {
        onClickRef.current();
      }
    };

    window.addEventListener('click', listener, { capture: true });
    return () => {
      window.removeEventListener('click', listener);
    };
  }, []);
}