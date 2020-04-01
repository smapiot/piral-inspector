import { FC } from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { jsx } from '@emotion/core';
import { useStore } from './store';

export interface RecordedEventsProps {}

export const RecordedEvents: FC<RecordedEventsProps> = () => {
  const events = useStore(m => m.state.events);
  return (
    <ListGroup>
      {events.map(ev => (
        <ListGroupItem key={ev.id}>
          <ListGroupItemHeading>
            {ev.name} @ {new Date(ev.time).toTimeString()}
          </ListGroupItemHeading>
          <ListGroupItemText>{JSON.stringify(ev.args)}</ListGroupItemText>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};
