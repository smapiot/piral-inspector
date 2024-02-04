import { jsx } from '@emotion/core';
import { FC, Fragment } from 'react';
import { ListGroup, ListGroupItem, Button, Input, FormGroup, Label } from 'reactstrap';
import { removePilet, togglePilet } from './commands';
import { useStore } from './store';
import { customSwitchStyle } from './styles';

export interface AvailablePiletsProps {}

export const AvailablePilets: FC<AvailablePiletsProps> = () => {
  const pilets = useStore((m) => m.state.pilets) ?? [];

  return (
    <Fragment>
      <ListGroup>
        {pilets.map((pilet) => (
          <ListGroupItem key={pilet.name}>
            <Button onClick={() => removePilet(pilet.name)} close style={{ float: 'right' }} />
            <FormGroup switch>
              <Input
                css={customSwitchStyle}
                type="switch"
                id={`toggle-${pilet.name}`}
                checked={!pilet.disabled}
                onClick={() => togglePilet(pilet.name)}
              />
              <Label check>{pilet.name}</Label>
            </FormGroup>
          </ListGroupItem>
        ))}
      </ListGroup>
    </Fragment>
  );
};
