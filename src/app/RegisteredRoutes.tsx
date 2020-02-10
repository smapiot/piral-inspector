import { FC } from 'react';
import { jsx } from '@emotion/core';
import { goToRoute } from './commands';
import { useStore } from './store';
import { piletListView } from './styles';

interface ShowRouteProps {
  route: string;
}

const ShowRoute: FC<ShowRouteProps> = ({ route }) => {
  const path = route.replace(/:[a-zA-Z0-9]+\??/g, '');
  //TODO allow setting values for the parameters
  return (
    <li>
      <button onClick={() => goToRoute(path)}>open</button> {route}
    </li>
  );
};

export interface RegisteredRoutesProps {}

export const RegisteredRoutes: FC<RegisteredRoutesProps> = () => {
  const { routes } = useStore(m => m.state);
  return <ul css={piletListView}>{routes && routes.map(route => <ShowRoute key={route} route={route} />)}</ul>;
};
