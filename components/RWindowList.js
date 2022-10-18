import RButton from './RButton';

export default function RWindowList({ windows, isActive, focusWindow }) {
  return (
    <>
      {windows.map(win =>
        <RButton
          key={win.id}
          onClick={focusWindow(win.id)}
          active={isActive(win.id)}
          bold={isActive(win.id)}
        >{win.title}</RButton>
      )}
    </>
  );
}