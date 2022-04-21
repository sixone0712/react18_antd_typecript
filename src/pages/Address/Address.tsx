import React from 'react';
import { css } from '@emotion/react';
import AddressBook from '../../components/modules/AddressBook';

export type AddressProps = {
  children?: React.ReactNode;
};

export default function Address({ children }: AddressProps): JSX.Element {
  return (
    <div css={style}>
      <AddressBook />
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  margin: 0.5rem;
`;
