import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
  useRouteError,
  createBrowserRouter,
  Link,
  RouterProvider,
} from 'react-router-dom';

import { getRxStorageIpcRenderer } from 'rxdb/plugins/electron';
import { getRxStorageLoki } from 'rxdb/plugins/storage-lokijs';

import icon from '../../assets/icon.svg';
import './App.css';
import { getDatabase } from './db';
import { useState } from 'react';

function Hello() {
  return (
    <div>
      <h1>ASIV 2023a</h1>
      <ul>
        <li>
          <Link to="1">1</Link>{' '}
        </li>
        <li>
          <Link to="2">2</Link>{' '}
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

function BarView() {
  return <div>Bar</div>;
}

function BazView() {
  const [database, setDatabase] = useState(null as any);

  function selectFile() {
    console.log(window.electron);
    //
    (window as any).electronStuff.openFileDialog();
    (window as any).electronStuff.ipcRenderer.once(
      'selected-file',
      (event: any, path: string) => {
        console.log('File path:', path, event);
      },
    );
  }

  function sendPing() {
    window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
  }

  async function loadDatabase() {
    console.log(window.electron);
    const storage = getRxStorageIpcRenderer({
      key: 'main-storage',
      statics: getRxStorageLoki({}).statics,
      // statics: getRxStorageMemory().statics,
      ipcRenderer: (window as any).electronStuff.ipcRenderer,
      mode: 'storage',
    });
    const database = await getDatabase(
      'heroes',
      // "heroesdb" + dbSuffix, // we add a random timestamp in dev-mode to reset the database on each start
      storage,
    );
    console.log(window);
    console.log(database);
  }

  return (
    <div>
      <h3>Baz</h3>
      <button type="button" onClick={loadDatabase}>
        Load database
      </button>
      <button type="button" onClick={selectFile}>
        Open directory
      </button>
      <button type="button" onClick={sendPing}>
        Ping
      </button>
    </div>
  );
}
export const router = createBrowserRouter([
  {
    path: '/index.html',
    element: <Hello />,

    errorElement: <ErrorPage />,
    children: [
      { path: '1', element: <BarView /> },
      { path: '2', element: <BazView /> },
    ],
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
