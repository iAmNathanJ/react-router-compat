import * as React from 'react';
import { Fragment } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  useLocation,
  useNavigate,
  Location,
  Outlet,
} from 'react-router-dom';
import './style.css';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Layout />,
    children: [
      {
        path: '1',
        element: <h1>1</h1>,
      },
      {
        path: '2',
        element: (
          <Fragment>
            <h1>2</h1>
            <Outlet />
          </Fragment>
        ),
        children: [
          {
            path: 'sub',
            element: (
              <Fragment>
                <h2>Sub</h2>
                <SearchParamChanger />
              </Fragment>
            ),
          },
        ],
      },
      {
        path: 'cdm',
        element: <HasCDM />,
      },
      {
        element: <NotFound />,
      },
    ],
  },
]);

function HasCDM() {
  const navigate = useNavigate();

  return <CDM navigate={navigate} />;
}

class CDM extends React.Component<{ navigate: any }> {
  componentDidMount() {
    console.log('did mount');
    this.props.navigate({ search: '?cdm=1' });
  }

  render() {
    return <h1>componentDidMount</h1>;
  }
}

function Layout() {
  return (
    <Fragment>
      <PageState />
      <Nav />
      <Outlet />
    </Fragment>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}

function PageState() {
  const location = useLocation();

  return (
    <Fragment>
      <code>{`router location: ${JSON.stringify(location)}`}</code>
      <hr />
    </Fragment>
  );
}

function Nav() {
  return (
    <nav>
      <Link to="/1">/1</Link>
      <br />
      <Link to={{ pathname: '/2', search: 'foo=bar' }}>/2</Link>
      <br />
      <Link to="/2/sub">/2/sub</Link>
      <br />
      <Link to="/cdm">/cdm</Link>
      <br />
      <OrderOfOps />
    </nav>
  );
}

function NotFound() {
  return <h1>404</h1>;
}

function SearchParamChanger() {
  // const location = useLocation();
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    navigate({ search: '?foo=1' });
  }, []);

  return <div>SearchParamChanger</div>;
}

function OrderOfOps() {
  return (
    <LogEffects name="1">
      <LogEffects name="2">
        <LogEffects name="3" />
      </LogEffects>
    </LogEffects>
  );
}

function LogEffects({
  name,
  children,
}: {
  name: string;
  children?: React.ReactNode;
}) {
  React.useLayoutEffect(() => {
    console.log(`${name} layout effect`);
    return () => console.log(`${name} layout effect cleanup`);
  });

  React.useEffect(() => {
    console.log(`${name} effect`);
    return () => console.log(`${name} effect cleanup`);
  });

  return <React.Fragment>{children || null}</React.Fragment>;
}
