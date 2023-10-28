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
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  return (
    <div>
      <h1>ASIV 2023a</h1>
      <ul>
        <li><Link to="1">1</Link> </li>
        <li><Link to="2">2</Link> </li>
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
  return <div>Baz</div>;
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
