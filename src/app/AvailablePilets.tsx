import { FC } from 'react';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import { jsx } from '@emotion/core';
import { removePilet } from './commands';
import { useStore } from './store';

export interface AvailablePiletsProps {}

export const AvailablePilets: FC<AvailablePiletsProps> = () => {
  const pilets = useStore(m => m.state.pilets);
  return (
    <ListGroup>
      {pilets &&
        pilets.map(pilet => (
          <ListGroupItem key={pilet.name}>
            <Button onClick={() => removePilet(pilet.name)} close />
            {pilet.name}
          </ListGroupItem>
        ))}
    </ListGroup>
  );
};
