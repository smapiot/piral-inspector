import { FC } from 'react';
import { ListGroup, ListGroupItem, Button, CustomInput } from 'reactstrap';
import { jsx } from '@emotion/core';
import { removePilet, togglePilet } from './commands';
import { useStore } from './store';

export interface AvailablePiletsProps {}

export const AvailablePilets: FC<AvailablePiletsProps> = () => {
  const pilets = useStore(m => m.state.pilets) ?? [];

  return (
    <ListGroup>
      {pilets.map(pilet => (
        <ListGroupItem key={pilet.name}>
          <Button onClick={() => removePilet(pilet.name)} close />
          <CustomInput
            type="switch"
            id={`toggle-${pilet.name}`}
            label={pilet.name}
            checked={!pilet.disabled}
            onChange={() => togglePilet(pilet.name)}
          />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};
