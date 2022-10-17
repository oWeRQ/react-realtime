import { useEffect, useState } from 'react';
import getReferencePlace from '../functions/getReferencePlace';

export default function useReferencePlace(referenceRef, elementRef, placement) {
  const [style, setStyle] = useState();

  useEffect(() => {
    const place = getReferencePlace(referenceRef.current, elementRef.current, placement);
    setStyle({
      left: place.left + 'px',
      top: place.top + 'px',
    });
  }, [referenceRef, elementRef, placement]);

  return style;
}