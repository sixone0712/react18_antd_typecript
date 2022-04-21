import React from 'react';
import { css } from '@emotion/react';
import AddressBookSider from './AddressBookSider';
import AddressBookContent from './AddressBookContent';
import AddressBookAddEditEmail from './AddressBookAddEditEmail';
import AddressBookAddEditGroup from './AddressBookAddEditGroup';

export type AddressBookProps = {
  children?: React.ReactNode;
};

export default function AddressBook({ children }: AddressBookProps): JSX.Element {
  return (
    <div css={style}>
      <AddressBookSider />
      <AddressBookContent />
      <AddressBookAddEditEmail />
      <AddressBookAddEditGroup />
    </div>
  );
}

const style = css`
  display: flex;
  flex-direction: row;
`;
