import { FC, Fragment, useState } from 'react';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import { jsx } from '@emotion/core';
import { useStore } from './store';

function display(value: any) {
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'bigint':
    case 'symbol':
      return (
        <span>
          <b>({typeof value})</b> <code>{value.toString()}</code>
        </span>
      );
    case 'object':
      if (Array.isArray(value)) {
        return (
          <span>
            <b>(Array)</b> <code>[{value.length} entries]</code>
          </span>
        );
      } else if (!value) {
        return (
          <span>
            <code>null</code>
          </span>
        );
      } else {
        return (
          <span>
            <b>(Object)</b> <code>[{Object.keys(value).length} keys]</code>
          </span>
        );
      }
    case 'undefined':
      return (
        <span>
          <code>undefined</code>
        </span>
      );
    default:
      return (
        <span>
          <b>(unknown)</b> <code>{typeof value}</code>
        </span>
      );
  }
}

function removeIfEmpty(value: any) {
  /**
   * We have an object (non-null) that has no keys -> potentially should be removed.
   */
  if (typeof value === 'object' && value && Object.keys(value).length === 0) {
    return false;
  }

  return true;
}

export interface StateContainerProps {}

export const StateContainer: FC<StateContainerProps> = () => {
  const container = useStore(m => m.state.container);
  const [path, setPath] = useState([]);
  const current = path.reduce((prev, curr) => prev[curr] ?? {}, container);

  return (
    <Fragment>
      <Breadcrumb>
        <BreadcrumbItem>
          <a
            href="#"
            onClick={e => {
              setPath(path.slice(0, 0));
              e.preventDefault();
            }}>
            #
          </a>
        </BreadcrumbItem>
        {path.map((item, i) => (
          <BreadcrumbItem key={`${i}_${item}`}>
            <a
              href="#"
              onClick={e => {
                setPath(path.slice(0, i + 1));
                e.preventDefault();
              }}>
              {item}
            </a>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <ListGroup>
        {Object.keys(current)
          .filter(c => removeIfEmpty(current[c]))
          .map(c => (
            <ListGroupItem
              key={c}
              tag="a"
              href="#"
              action
              onClick={e => {
                setPath([...path, c]);
                e.preventDefault();
              }}>
              <ListGroupItemHeading>{c}</ListGroupItemHeading>
              <ListGroupItemText>{display(current[c])}</ListGroupItemText>
            </ListGroupItem>
          ))}
      </ListGroup>
    </Fragment>
  );
};
