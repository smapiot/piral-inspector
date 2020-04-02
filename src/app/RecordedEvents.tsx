import { FC, useState } from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { jsx } from '@emotion/core';
import { EmitEventModal } from './EmitEventModal';
import { useStore } from './store';

export interface RecordedEventsProps {}

export const RecordedEvents: FC<RecordedEventsProps> = () => {
  const [isOpen, setOpen] = useState(false);
  const events = useStore(m => m.state.events);
  const toggle = () => setOpen(!isOpen);

  return (
    <ListGroup>
      <EmitEventModal isOpen={isOpen} toggle={toggle} />
      <ListGroupItem
        action
        onClick={e => {
          toggle();
          e.preventDefault();
        }}
        tag="a"
        href="#">
        Emit new event
      </ListGroupItem>
      {events.map(ev => (
        <ListGroupItem key={ev.id}>
          <ListGroupItemHeading>
            {ev.name} @ {new Date(ev.time).toLocaleTimeString('it-IT')}
          </ListGroupItemHeading>
          <ListGroupItemText>
            <pre>{JSON.stringify(ev.args, undefined, 2)}</pre>
          </ListGroupItemText>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};
