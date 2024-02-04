import { jsx } from '@emotion/core';
import { FC } from 'react';
import { ListGroup } from 'reactstrap';
import { ShowRoute } from './ShowRoute';
import { useStore } from './store';

export interface RegisteredRoutesProps {}

export const RegisteredRoutes: FC<RegisteredRoutesProps> = () => {
  const routes = useStore(m => m.state.routes);
  return (
    <ListGroup>
      {routes && routes.map(route => <ShowRoute key={route} route={route} />)}
      <ShowRoute route="/:custom" />
    </ListGroup>
  );
};
