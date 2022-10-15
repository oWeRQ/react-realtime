function getOffsetParent(el) {
  if (el.offsetParent === document.body && window.getComputedStyle(el.offsetParent).position === 'static') {
    return document.documentElement;
  }

  return el.offsetParent;
}

function getScrollOffset(el) {
  if (el !== document.documentElement) {
    return {
      left: el.scrollLeft,
      top: el.scrollTop,
    };
  }

  return {
    left: 0,
    top: 0,
  };
}

function getPlacementOffset(reference, element, placement) {
  switch (placement) {
    case 'top':
      return {
        left: reference.width / 2 - element.width / 2,
        top: -element.height,
      };
    case 'top-start':
      return {
        left: 0,
        top: -element.height,
      };
    case 'top-end':
      return {
        left: reference.width - element.width,
        top: -element.height,
      };
    case 'bottom':
      return {
        left: reference.width / 2 - element.width / 2,
        top: reference.height,
      };
    case 'bottom-start':
      return {
        left: 0,
        top: reference.height,
      };
    case 'bottom-end':
      return {
        left: reference.width - element.width,
        top: reference.height,
      };
    case 'right':
      return {
        left: reference.width,
        top: reference.height / 2 - element.height / 2,
      };
    case 'right-start':
      return {
        left: reference.width,
        top: 0,
      };
    case 'right-end':
      return {
        left: reference.width,
        top: reference.height - element.height,
      };
    case 'left':
      return {
        left: -element.width,
        top: reference.height / 2 - element.height / 2,
      };
    case 'left-start':
      return {
        left: -element.width,
        top: 0,
      };
    case 'left-end':
      return {
        left: -element.width,
        top: reference.height - element.height,
      };
  }
}

export default function getReferencePlace(reference, element, placement) {
  const parent = getOffsetParent(element);
  const referenceRect = reference.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const position = getPlacementOffset(referenceRect, elementRect, placement);
  const scroll = getScrollOffset(parent);

  const left = referenceRect.left - parentRect.left + scroll.left + position.left;
  const top = referenceRect.top - parentRect.top + scroll.top + position.top;

  return {
    left: left,
    top: top,
    right: parent.clientWidth - elementRect.width - left,
    bottom: parent.clientHeight - elementRect.height - top,
    width: elementRect.width,
    height: elementRect.height,
  };
}