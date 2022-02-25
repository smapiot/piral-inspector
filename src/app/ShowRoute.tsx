import { FC, useState, useMemo } from 'react';
import { ListGroupItem } from 'reactstrap';
import { jsx } from '@emotion/core';
import { ConfigureRouteModal } from './ConfigureRouteModal';
import { goToRoute } from './commands';

export interface ShowRouteProps {
  route: string;
}

const paramsRx = /:([a-zA-Z0-9]+)\??/g;

function getParameters(route: string) {
  const parameters: Array<string> = [];
  let result = paramsRx.exec(route);

  while (result) {
    parameters.push(result[1]);
    result = paramsRx.exec(route);
  }

  return parameters;
}

export const ShowRoute: FC<ShowRouteProps> = ({ route }) => {
  const parameters = useMemo(() => getParameters(route), [route]);
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!isOpen);
  const hasParams = parameters.length > 0;

  return (
    <ListGroupItem
      action
      tag="a"
      href="#"
      onClick={e => {
        hasParams ? toggle() : goToRoute(route);
        e.preventDefault();
      }}>
      {hasParams && <ConfigureRouteModal isOpen={isOpen} toggle={toggle} parameters={parameters} route={route} />}
      {route}
    </ListGroupItem>
  );
};
