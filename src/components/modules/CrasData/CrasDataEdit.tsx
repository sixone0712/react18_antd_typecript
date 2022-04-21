import { blue } from '@ant-design/colors';
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Empty, Space, Table } from 'antd';
import React, { useCallback } from 'react';
import useCrasDataEdit from '../../../hooks/useCrasDataEdit';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { CrasDataManualInfo } from '../../../types/crasData';
import CustomIcon from '../../atoms/CustomIcon';
import TableTitle from '../../atoms/TableTitle';
import CrasDataEditCreateDrawer from './CrasDataEditCreateDrawer';
import CrasDataEditJudgeDrawer from './CrasDataEditJudgeDrawer';
export type CrasDataEditCreateProps = {
  type: 'create' | 'judge';
};

export default function CrasDataEdit({ type }: CrasDataEditCreateProps): JSX.Element {
  const {
    manualList,
    isFetchingList,
    openDeleteModal,
    openEditModal,
    openAddModal,
    refreshList,
    goBack,
    siteName,
  } = useCrasDataEdit({ type });

  const titleRender = useCallback(
    () => (
      <TableTitle
        title={
          <Space size={2}>
            <Badge color="blue" />
            <div>{`Registered Items : ${manualList?.length ?? 0}`}</div>
          </Space>
        }
        btn1={{
          name: 'Add',
          icon: <PlusOutlined />,
          onClick: openAddModal,
        }}
        btn2={{
          icon: <ReloadOutlined />,
          onClick: refreshList,
          loading: isFetchingList,
        }}
      />
    ),
    [manualList, openAddModal, refreshList, isFetchingList]
  );

  const numberRender = useCallback((value: number, record: CrasDataManualInfo, index: number) => value + 1, []);

  const enableRender = useCallback(
    (value: boolean, record: CrasDataManualInfo, index: number) => (value ? <CheckOutlined /> : ''),
    []
  );

  const editRenter = useCallback(
    (value: number, record: CrasDataManualInfo, index: number) => {
      const onClick = () => openEditModal(value);
      return <EditOutlined css={iconStyle} onClick={onClick} />;
    },
    [openEditModal]
  );

  const deleteRender = useCallback(
    (value: number, record: CrasDataManualInfo, index: number) => {
      const onClick = () => openDeleteModal(value);
      return <DeleteOutlined css={iconStyle} onClick={onClick} />;
    },
    [openDeleteModal]
  );

  return (
    <div css={style}>
      <div className="title">
        <CustomIcon className="go-back" name="go_back" onClick={goBack} />
        <span className="name">
          {type === 'create'
            ? `Edit Create Cras Data Item (${siteName})`
            : `Edit Cras Data Judge Rules Item (${siteName})`}
        </span>
      </div>
      <Table<CrasDataManualInfo>
        rowKey={'id'}
        dataSource={isFetchingList ? undefined : manualList}
        bordered
        title={titleRender}
        size="middle"
        pagination={{
          position: ['bottomCenter'],
          total: manualList?.length ?? 0,
          showSizeChanger: true,
        }}
        loading={isFetchingList}
        css={tableStyle}
        locale={{
          emptyText: isFetchingList ? <Empty description="Loading" /> : <Empty description="No Data" />,
        }}
      >
        <Table.Column<CrasDataManualInfo> {...createCrasColumnProps.index} render={numberRender} />
        <Table.Column<CrasDataManualInfo> {...createCrasColumnProps.itemName} />
        <Table.Column<CrasDataManualInfo> {...createCrasColumnProps.enable} render={enableRender} />
        <Table.Column<CrasDataManualInfo> {...createCrasColumnProps.edit} render={editRenter} />
        <Table.Column<CrasDataManualInfo> {...createCrasColumnProps.delete} render={deleteRender} />
      </Table>
      <CrasDataEditCreateDrawer />
      <CrasDataEditJudgeDrawer />
    </div>
  );
}

const style = css`
  .title {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    .name {
      margin-left: 1rem;
    }
    .go-back {
      &:hover {
        color: ${blue[4]};
      }
      &:active {
        color: ${blue[6]};
      }
    }
  }
`;

const tableStyle = css`
  width: 86rem;
`;

const iconStyle = css`
  font-size: 1rem;
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

type CreateCrasColumnName = 'index' | 'itemName' | 'enable' | 'edit' | 'delete';

const createCrasColumnProps: TableColumnPropsType<CrasDataManualInfo, CreateCrasColumnName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },
  itemName: {
    key: 'itemName',
    title: <TableColumnTitle>Item Name</TableColumnTitle>,
    dataIndex: 'itemName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'itemName'),
    },
    shouldCellUpdate: (cur, prev) => cur.itemName !== prev.itemName,
  },

  enable: {
    key: 'enable',
    title: <TableColumnTitle>Enable</TableColumnTitle>,
    dataIndex: 'enable',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'itemName'),
    },
    shouldCellUpdate: (cur, prev) => cur.enable !== prev.enable,
  },
  edit: {
    key: 'edit',
    title: <TableColumnTitle>Edit</TableColumnTitle>,
    dataIndex: 'itemId',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.itemId !== prev.itemId,
  },
  delete: {
    key: 'delete',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    dataIndex: 'itemId',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.itemId !== prev.itemId,
  },
};
