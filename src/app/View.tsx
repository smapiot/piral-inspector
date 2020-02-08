import * as React from 'react';
import { useStore } from './store';
import { removePilet } from './commands';

export interface ViewProps {}

export const View: React.FC<ViewProps> = () => {
  const { connected, name, version, pilets } = useStore(m => m.state);

  if (connected) {
    return (
      <div>
        <b>
          Connected to {name} ({version})!
        </b>
        <ul>
          {pilets &&
            pilets.map(pilet => (
              <li key={pilet.name}>
                {pilet.name} <button onClick={() => removePilet(pilet.name)}>x</button>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  return <div>Not connected.</div>;
};
