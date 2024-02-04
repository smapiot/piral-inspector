import { jsx } from '@emotion/core';
import { FC, Fragment } from 'react';
import { ListGroup, ListGroupItem, Button, Input } from 'reactstrap';
import { removePilet, togglePilet } from './commands';
import { useStore } from './store';
import { customSwitchStyle } from './styles';

export interface AvailablePiletsProps {}

export const AvailablePilets: FC<AvailablePiletsProps> = () => {
  const pilets = useStore(m => m.state.pilets) ?? [];

  return (
    <Fragment>
      <ListGroup>
        {pilets.map(pilet => (
          <ListGroupItem key={pilet.name}>
            <Button onClick={() => removePilet(pilet.name)} close />
            <Input
              css={customSwitchStyle}
              type="switch"
              id={`toggle-${pilet.name}`}
              label={pilet.name}
              checked={!pilet.disabled}
              onChange={() => togglePilet(pilet.name)}
            />
          </ListGroupItem>
        ))}
      </ListGroup>
    </Fragment>
  );
};
