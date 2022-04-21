import { blue } from '@ant-design/colors';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Empty, Table } from 'antd';
import React, { useCallback, useMemo } from 'react';
import Highlighter from 'react-highlight-words';
import AsyncCreatableSelect from 'react-select/async-creatable';
import useAddressBookContent from '../../../hooks/useAddressBookContent';
import { AddressInfo } from '../../../lib/api/axios/types';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { DEFAULT_ALL_ADDRESS_KEY } from '../../../reducers/slices/address';
import { TableColumnPropsType } from '../../../types/common';
import TableHeader from '../TableHeader';
export type AddressBookContentProps = {};

export default function AddressBookContent({}: AddressBookContentProps): JSX.Element {
  const {
    addressList,
    isFetchingAddress,
    rowSelection,
    handleChange,
    openEmailModal,
    selectedGroupId,
    selectedGroupName,
    searchedKeyword,
    openEmailDeleteModal,
    refreshAddressList,
    selectEmail,
    deboundcedSearch,
    handleCreate,
    onRow,
    selectRef,
    onSelectEscKeyPress,
  } = useAddressBookContent();

  const titleRender = useCallback(
    () => (
      <TableHeader
        title={
          searchedKeyword
            ? `${selectedGroupName} (${addressList?.length ?? 0}) | ${searchedKeyword}`
            : `${selectedGroupName} | ${addressList?.length ?? 0}`
        }
        button1={
          selectedGroupId === DEFAULT_ALL_ADDRESS_KEY
            ? {
                name: 'Delete',
                icon: <DeleteOutlined />,
                onClick: openEmailDeleteModal,
                disabled: selectEmail.length === 0,
              }
            : undefined
        }
        button2={{
          icon: <ReloadOutlined />,
          onClick: refreshAddressList,
        }}
      />
    ),
    [selectedGroupId, selectedGroupName, addressList, openEmailDeleteModal, selectEmail]
  );

  const deleteRender = useCallback(
    (value: number, record: AddressInfo, index: number) => (
      <EditOutlined css={iconStyle} onClick={() => openEmailModal(record)} />
    ),
    [openEmailModal]
  );

  const TableRender = useMemo(
    () => (
      <Table<AddressInfo>
        title={titleRender}
        rowKey={'id'}
        dataSource={isFetchingAddress ? undefined : addressList}
        bordered
        size="middle"
        pagination={{
          position: ['bottomCenter'],
          total: addressList?.length ?? 0,
          showSizeChanger: true,
        }}
        rowSelection={rowSelection}
        loading={isFetchingAddress}
        css={tableStyle}
        tableLayout="fixed"
        locale={{
          emptyText: isFetchingAddress ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Loading" />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ),
        }}
        onRow={onRow}
      >
        <Table.Column<AddressInfo> {...addressColumProps.name} />
        <Table.Column<AddressInfo> {...addressColumProps.email} />
        <Table.Column<AddressInfo> {...addressColumProps.edit} width={100} render={deleteRender} />
      </Table>
    ),
    [titleRender, isFetchingAddress, addressList, rowSelection, onRow]
  );

  const SelectRender = useMemo(
    () => (
      <AsyncCreatableSelect
        classNamePrefix="address"
        formatOptionLabel={formatOptionLabel}
        placeholder="Search Name/Email Address"
        value={null}
        formatCreateLabel={(userInput) => `Search all list for '${userInput}'`}
        isSearchable
        loadOptions={deboundcedSearch}
        onChange={handleChange}
        onCreateOption={handleCreate}
        css={searchStyle}
        focusDefaultOption={false}
        createOptionPosition="first"
        ref={selectRef}
        onKeyDown={onSelectEscKeyPress}
      />
    ),
    [deboundcedSearch, handleChange, handleCreate, selectRef, onSelectEscKeyPress]
  );

  return (
    <div css={style}>
      {SelectRender}
      {TableRender}
    </div>
  );
}

function formatOptionLabel(
  { label, __isNew__ }: { label: string; __isNew__: boolean },
  { inputValue }: { inputValue: string }
) {
  return (
    <Highlighter
      searchWords={[inputValue]}
      textToHighlight={label}
      autoEscape={true}
      highlightStyle={{ padding: 0, fontWeight: 700, backgroundColor: 'transparent' }}
    />
  );
}

const style = css`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const searchStyle = css`
  width: 50rem;

  .address__control {
    z-index: 100;
    border-radius: 2px;
    &:hover {
      border-color: #40a9ff;
    }
  }
`;

const tableStyle = css`
  margin-top: 1rem;
  width: 65rem;
`;

export type AddressColumnName = 'name' | 'email' | 'edit';

const addressColumProps: TableColumnPropsType<AddressInfo, AddressColumnName> = {
  name: {
    key: 'name',
    title: <TableColumnTitle>Name</TableColumnTitle>,
    dataIndex: 'name',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'name'),
    },
    shouldCellUpdate: (cur, prev) => cur.name !== prev.name,
  },

  email: {
    key: 'email',
    title: <TableColumnTitle>Email</TableColumnTitle>,
    dataIndex: 'email',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'email'),
    },
    shouldCellUpdate: (cur, prev) => cur.email !== prev.email,
  },

  edit: {
    key: 'edit',
    title: <TableColumnTitle>Edit</TableColumnTitle>,
    dataIndex: 'jobId',
    align: 'center',
  },
};

const iconStyle = css`
  /* font-size: 1.25rem; */
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;
