import mapBy from '../functions/mapBy';
import Calculator from './Calculator';
import Cast from './Cast';
import Chat from './Chat';
import Note from './Note';
import Paint from './Paint';
import ToDo from './ToDo';

const apps = [
  {
    id: 'Calculator',
    name: 'Calculator',
    component: Calculator,
  },
  {
    id: 'Cast',
    name: 'Cast',
    component: Cast,
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
    id: 'Paint',
    name: 'Paint',
    component: Paint,
  },
  {
    id: 'ToDo',
    name: 'ToDo',
    component: ToDo,
  },
];

export const appsById = mapBy(apps, v => v.id);

export default apps;