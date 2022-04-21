import { blue } from '@ant-design/colors';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Empty, Space, Table } from 'antd';
import React, { useCallback } from 'react';
import useCrasDataList from '../../../hooks/useCrasDataList';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { CrasDataInfo } from '../../../types/crasData';
import TableTitle from '../../atoms/TableTitle';
import CrasDataAddModal from './CrasDataAddModal';
import CrasDataImportModal from './CrasDataImportModal';

export type CrasDataStatusProps = {};

export default function CrasDataStatus({}: CrasDataStatusProps): JSX.Element {
  const {
    list,
    openDeleteModal,
    openImportModal,
    openExportModal,
    openEditModal,
    openAddModal,
    isFetching,
    refreshStatusList,
  } = useCrasDataList();

  const titleRender = useCallback(
    () => (
      <TableTitle
        title={
          <Space size={2}>
            <Badge color="blue" />
            <div>{`Registered Cras Data Items : ${list?.length ?? 0}`}</div>
          </Space>
        }
        btn1={{
          name: 'Add',
          icon: <PlusOutlined />,
          onClick: openAddModal,
        }}
        btn2={{
          icon: <ReloadOutlined />,
          onClick: refreshStatusList,
          loading: isFetching,
        }}
      />
    ),
    [list, openAddModal, refreshStatusList, isFetching]
  );

  const numberRender = useCallback((value: number, record: CrasDataInfo, index: number) => value + 1, []);

  const ImportRender = useCallback(
    (value: number, record: CrasDataInfo, index: number) => {
      const onClick = () => openImportModal(value);
      return <ImportOutlined css={iconStyle} onClick={onClick} />;
    },
    [openImportModal]
  );

  const exportRender = useCallback(
    (value: number, record: CrasDataInfo, index: number) => {
      const onClick = () => openExportModal(value);
      const disabled = false;
      // const disabled = record.crasDataJudgeRulesItemCount <= 0 && record.createCrasDataItemCount <= 0 ? true : false;
      return (
        <div css={iconDisableStyle(disabled)}>
          <ExportOutlined onClick={onClick} />
        </div>
      );
    },
    [openExportModal]
  );

  const createEditRender = useCallback(
    (value: number, record: CrasDataInfo, index: number) => {
      const onClick = () => openEditModal('create', record.id, record.companyFabName);
      return (
        <Space>
          <div>{value} Items</div>
          <EditOutlined css={iconStyle} onClick={onClick} />
        </Space>
      );
    },
    [openEditModal]
  );

  const judgeEditRender = useCallback(
    (value: number, record: CrasDataInfo, index: number) => {
      const onClick = () => openEditModal('judge', record.id, record.companyFabName);
      return (
        <Space>
          <div>{value} Items</div>
          <EditOutlined css={iconStyle} onClick={onClick} />
        </Space>
      );
    },
    [openEditModal]
  );

  const deleteRender = useCallback(
    (value: number, record: CrasDataInfo, index: number) => {
      const onClick = () => openDeleteModal(value);
      return <DeleteOutlined css={iconStyle} onClick={onClick} />;
    },
    [openDeleteModal]
  );

  return (
    <>
      <Table<CrasDataInfo>
        rowKey={'id'}
        dataSource={isFetching ? undefined : list}
        bordered
        title={titleRender}
        size="middle"
        pagination={{
          position: ['bottomCenter'],
          total: list?.length ?? 0,
          showSizeChanger: true,
        }}
        loading={isFetching}
        css={tableStyle}
        locale={{
          emptyText: isFetching ? <Empty description="Loading" /> : <Empty description="No Data" />,
        }}
      >
        <Table.Column<CrasDataInfo> {...statusColumnProps.index} render={numberRender} />
        <Table.Column<CrasDataInfo> {...statusColumnProps.companyFabName} />
        <Table.Column<CrasDataInfo> {...statusColumnProps.createCrasDataItemCount} render={createEditRender} />
        <Table.Column<CrasDataInfo> {...statusColumnProps.crasDataJudgeRulesItemCount} render={judgeEditRender} />
        <Table.Column<CrasDataInfo> {...statusColumnProps.date} />
        <Table.Column<CrasDataInfo> {...statusColumnProps.import} render={ImportRender} />
        <Table.Column<CrasDataInfo> {...statusColumnProps.export} render={exportRender} />
        <Table.Column<CrasDataInfo> {...statusColumnProps.delete} render={deleteRender} />
      </Table>
      <CrasDataAddModal />
      <CrasDataImportModal />
    </>
  );
}

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

const iconDisableStyle = (disabled: boolean) => css`
  font-size: 1rem;
  ${!disabled &&
  css`
    &:hover {
      color: ${blue[4]};
    }
    &:active {
      color: ${blue[6]};
    }
  `}

  ${disabled &&
  css`
    cursor: not-allowed !important;
    span {
      pointer-events: none;
    }
    color: rgba(0, 0, 0, 0.25);
  `}
`;

type StatusColumnName =
  | 'index'
  | 'companyFabName'
  | 'createCrasDataItemCount'
  | 'crasDataJudgeRulesItemCount'
  | 'date'
  | 'import'
  | 'export'
  | 'delete';

const statusColumnProps: TableColumnPropsType<CrasDataInfo, StatusColumnName> = {
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
  companyFabName: {
    key: 'companyFabName',
    title: <TableColumnTitle>User-Fab Name</TableColumnTitle>,
    dataIndex: 'companyFabName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'companyFabName'),
    },
    shouldCellUpdate: (cur, prev) => cur.companyFabName !== prev.companyFabName,
  },
  createCrasDataItemCount: {
    key: 'createCrasDataItemCount',
    title: <TableColumnTitle>Create Cras Data Item</TableColumnTitle>,
    dataIndex: 'createCrasDataItemCount',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'createCrasDataItemCount'),
    },
    shouldCellUpdate: (cur, prev) =>
      cur.createCrasDataItemCount !== prev.createCrasDataItemCount ||
      cur.id !== prev.id ||
      cur.companyFabName !== prev.companyFabName,
  },
  crasDataJudgeRulesItemCount: {
    key: 'crasDataJudgeRulesItemCount',
    title: <TableColumnTitle>Cras Data Judge Rules Item</TableColumnTitle>,
    dataIndex: 'crasDataJudgeRulesItemCount',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasDataJudgeRulesItemCount'),
    },
    shouldCellUpdate: (cur, prev) =>
      cur.crasDataJudgeRulesItemCount !== prev.crasDataJudgeRulesItemCount ||
      cur.id !== prev.id ||
      cur.companyFabName !== prev.companyFabName,
  },
  date: {
    key: 'date',
    title: <TableColumnTitle>Last Updated</TableColumnTitle>,
    dataIndex: 'date',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'date'),
    },
    shouldCellUpdate: (cur, prev) => cur.date !== prev.date,
  },
  import: {
    key: 'id',
    dataIndex: 'id',
    title: <TableColumnTitle>Import</TableColumnTitle>,
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.id !== prev.id,
  },
  export: {
    key: 'export',
    dataIndex: 'id',
    title: <TableColumnTitle>Export</TableColumnTitle>,
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.id !== prev.id ||
      cur.createCrasDataItemCount !== prev.createCrasDataItemCount ||
      cur.crasDataJudgeRulesItemCount !== prev.crasDataJudgeRulesItemCount,
  },
  delete: {
    key: 'delete',
    dataIndex: 'id',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.id !== prev.id,
  },
};
