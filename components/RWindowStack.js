import RApp from './RApp';
import RWindow from './RWindow';

export default function RWindowList({ className, windows, isActive, focusWindow, closeWindow, updateWindow }) {
  const setPosition = id => position => updateWindow({ id, position });
  const setSize = id => size => updateWindow({ id, size });

  return (
    <div className={className}>
      {windows.map(win =>
        <RWindow
          key={win.id}
          title={win.title}
          zIndex={win.zIndex}
          position={win.position}
          size={win.size}
          active={isActive(win.id)}
          onClose={closeWindow(win.id)}
          onFocus={focusWindow(win.id)}
          setPosition={setPosition(win.id)}
          setSize={setSize(win.id)}
        >
          <RApp
            id={win.id}
            appId={win.appId}
            state={win.state}
            updateWindow={updateWindow}
          />
        </RWindow>
      )}
    </div>
  );
}