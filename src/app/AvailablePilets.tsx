import { FC } from 'react';
import { jsx } from '@emotion/core';
import { removePilet } from './commands';
import { useStore } from './store';
import { piletListView } from './styles';

export interface AvailablePiletsProps {}

export const AvailablePilets: FC<AvailablePiletsProps> = () => {
  const { pilets } = useStore(m => m.state);
  return (
    <ul css={piletListView}>
      {pilets &&
        pilets.map(pilet => (
          <li key={pilet.name}>
            <button onClick={() => removePilet(pilet.name)}>x</button> {pilet.name}
          </li>
        ))}
    </ul>
  );
};
