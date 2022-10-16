import mapBy from '../functions/mapBy';
import Calculator from './Calculator';
import Chat from './Chat';
import Note from './Note';

const apps = [
  {
    id: 'Calculator',
    name: 'Calculator',
    component: Calculator,
  },
  {
    id: 'Chat',
    name: 'Chat',
    component: Chat,
  },
  {
    id: 'Note',
    name: 'Note',
    component: Note,
  },
];

export const appsById = mapBy(apps, v => v.id);

export default apps;