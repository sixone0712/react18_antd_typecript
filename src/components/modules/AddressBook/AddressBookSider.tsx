import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Menu, Spin } from 'antd';
import React, { useMemo } from 'react';
import useAddressBookSider from '../../../hooks/useAddressBookSider';
import { DEFAULT_ALL_ADDRESS_KEY } from '../../../reducers/slices/address';
import CustomIcon from '../../atoms/CustomIcon';

export type AddressBookSiderProps = {};

export default function AddressBookSider({}: AddressBookSiderProps): JSX.Element {
  const {
    groups,
    isFetchingGroups,
    onClickMenuItem,
    currentSelect,
    openEmailAddModal,
    openGroupAddModal,
    openGroupEditModal,
    openGroupDeleteModal,
    refreshGroupList,
  } = useAddressBookSider();

  const groupList = useMemo(() => {
    if (!groups?.length) return [];

    return groups?.map((item) => (
      <Menu.Item key={item.id}>
        <div css={groupItemStyle}>
          <div className="name-area">
            <ItemSpace />
            <CustomIcon name="address_group" />
            <span className="name">{item.name}</span>
          </div>
          <div className="btn-area">
            <EditOutlined onClick={() => openGroupEditModal(item)} />
            <DeleteOutlined onClick={() => openGroupDeleteModal(item)} />
          </div>
        </div>
      </Menu.Item>
    ));
  }, [groups, openGroupEditModal, openGroupDeleteModal]);

  return (
    <div css={style}>
      <div className="button-contents">
        <Button className="btn" type="primary" onClick={() => openEmailAddModal()}>
          Add Email
        </Button>
        <Button className="btn" type="primary" onClick={() => openGroupAddModal()}>
          Add Group
        </Button>
      </div>

      <Menu
        onClick={onClickMenuItem}
        css={menuStyle}
        defaultSelectedKeys={[`${DEFAULT_ALL_ADDRESS_KEY}`]}
        // mode="inline"
        selectedKeys={[`${currentSelect}`]}
      >
        <Menu.Item key={DEFAULT_ALL_ADDRESS_KEY} disabled={isFetchingGroups}>
          <div css={groupItemStyle}>
            <div className="name-area">
              <CustomIcon name="all_address" />
              <span className="name">All Address</span>
            </div>
            <div className="btn-area">
              <ReloadOutlined onClick={refreshGroupList} />
            </div>
          </div>
        </Menu.Item>
        {!isFetchingGroups && groupList.length > 0 && groupList}
        {isFetchingGroups && (
          <Menu.Item disabled css={spinStyle}>
            <Spin />
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
}

const style = css`
  .button-contents {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    .btn {
      width: 9.5rem;
      border-radius: 0.625rem;
    }
  }
`;

const spinStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const menuStyle = css`
  width: 20rem;
  height: 48.75rem;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid rgb(240, 240, 240);
`;

const ItemSpace = styled.span`
  margin-right: 1rem;
`;

const groupItemStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .name-area {
    display: flex;
    align-items: center;
    .name {
      display: block;
      width: 11rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
