import mapBy from '../functions/mapBy';
import Calculator from './Calculator';
import Chat from './Chat';
import Note from './Note';
import ToDo from './ToDo';

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
  {
    id: 'ToDo',
    name: 'ToDo',
    component: ToDo,
  },
];

export const appsById = mapBy(apps, v => v.id);

export default apps;