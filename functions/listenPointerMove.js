export default function listenPointerMove(el, onMove, onEnd) {
	function onEndWrap(event) {
		if (typeof onEnd === 'function') {
			onEnd.call(this, event);
		}

		detach();
	}

	function attach() {
		el.addEventListener('mousemove', onMove, {passive: true});
		el.addEventListener('mouseup', onEndWrap, {passive: true});
		el.addEventListener('mouseleave', onEndWrap, {passive: true});

		el.addEventListener('touchmove', onMove, {passive: true});
		el.addEventListener('touchend', onEndWrap, {passive: true});
		el.addEventListener('touchcancel', onEndWrap, {passive: true});
	}

	function detach() {
		el.removeEventListener('mousemove', onMove);
		el.removeEventListener('mouseup', onEndWrap);
		el.removeEventListener('mouseleave', onEndWrap);

		el.removeEventListener('touchmove', onMove);
		el.removeEventListener('touchend', onEndWrap);
		el.removeEventListener('touchcancel', onEndWrap);
	}

	attach();

	return detach;
}