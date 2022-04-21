import { ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Checkbox, Space, Table, Tooltip } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useCallback } from 'react';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { PlanStatusType, RemoteJobDetailState, RemoteJobPlanDetailState } from '../../../types/Job';
import PopupTip from '../../atoms/PopupTip';
import TableTitle from '../../atoms/TableTitle';

export type RemoteJobPlanTableProps = {
  plans: RemoteJobPlanDetailState[] | undefined;
  selectPlanIds: RemoteJobDetailState['planIds'];
  setSelectPlanIds: (value: React.Key[]) => void;
  isFetchingPlans: boolean;
  refreshPlans: () => void;
  selectSiteInfo: LabeledValue;
};

export default React.memo(function RemoteJobPlanTable({
  plans,
  selectPlanIds,
  setSelectPlanIds,
  isFetchingPlans,
  refreshPlans,
  selectSiteInfo,
}: RemoteJobPlanTableProps): JSX.Element {
  const planTypeRender = useCallback(
    (value: string, record: RemoteJobPlanDetailState, index: number, type?: AutoPlansColumnName) => {
      return <div>{getPlanType(value)}</div>;
    },
    []
  );

  const statusRender = useCallback(
    (value: string, record: RemoteJobPlanDetailState, index: number, type?: AutoPlansColumnName) => {
      return (
        <Badge status={value === 'stop' ? 'error' : 'processing'} text={value === 'stop' ? 'Stopped' : 'Running'} />
      );
    },
    []
  );

  const detailRender = useCallback(
    (value: PlanStatusType, record: RemoteJobPlanDetailState, index: number, type?: AutoPlansColumnName) => {
      const text = value?.charAt(0).toUpperCase() + value?.slice(1) ?? 'Unknown';
      return (
        <>
          {record.error ? (
            <Tooltip color="red" title={<ErrorDetailPopup error={record.error} measure={record.measure} />}>
              <Badge color={getErrorDetailColor(value)} text={text} />
            </Tooltip>
          ) : (
            <Badge color={getErrorDetailColor(value)} text={text} />
          )}
        </>
      );
    },
    []
  );

  const mahcinesRender = useCallback(
    (value: number, record: RemoteJobPlanDetailState, index: number, type?: AutoPlansColumnName) =>
      PopupTip({ value, list: record.machineNames }),
    []
  );

  const targetsRender = useCallback(
    (value: number, record: RemoteJobPlanDetailState, index: number, type?: AutoPlansColumnName) =>
      PopupTip({ value, list: record.targetNames }),
    []
  );

  const titleRender = useCallback(
    () => (
      <TableTitle
        title={
          <Space size={2}>
            <Badge color="blue" />
            <div>{`Registered Plans : ${plans?.length ?? 0}`}</div>
          </Space>
        }
        btn1={{
          icon: <ReloadOutlined />,
          onClick: refreshPlans,
          loading: isFetchingPlans,
          disabled: !selectSiteInfo?.value,
        }}
      />
    ),
    [plans, isFetchingPlans, selectSiteInfo, refreshPlans]
  );

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: RemoteJobPlanDetailState[]) => {
    setSelectPlanIds(selectedRowKeys);
  };

  const toggleSelectAll = useCallback(() => {
    if (plans && plans.length > 0)
      setSelectPlanIds(
        selectPlanIds.length === plans.length ? [] : plans.map((r: RemoteJobPlanDetailState) => r.planId)
      );
  }, [plans, selectPlanIds, setSelectPlanIds]);

  const allCheckbox = () => (
    <Checkbox
      checked={selectPlanIds && selectPlanIds.length ? true : false}
      indeterminate={plans && selectPlanIds && selectPlanIds.length > 0 && selectPlanIds.length < plans.length}
      onChange={toggleSelectAll}
    />
  );

  const rowSelection: TableRowSelection<RemoteJobPlanDetailState> = {
    type: 'checkbox',
    selectedRowKeys: selectPlanIds,
    onChange: onSelectChange,
    columnTitle: allCheckbox,
  };

  const onRow = (record: RemoteJobPlanDetailState, rowIndex: number | undefined) => ({
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (record.planId !== undefined) {
        if (selectPlanIds.find((item) => item === record.planId) !== undefined) {
          setSelectPlanIds(selectPlanIds.filter((item) => item !== record.planId));
        } else {
          setSelectPlanIds(selectPlanIds.concat(record.planId));
        }
      }
    },
  });

  return (
    <Table<RemoteJobPlanDetailState>
      rowKey={'planId'}
      rowSelection={rowSelection}
      dataSource={plans}
      bordered
      title={titleRender}
      size="middle"
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
      loading={isFetchingPlans}
      onRow={onRow}
      tableLayout="fixed"
    >
      <Table.Column<RemoteJobPlanDetailState> {...autoPlansColumnProps.planName} width={200} />
      <Table.Column<RemoteJobPlanDetailState> {...autoPlansColumnProps.description} width={194} />
      <Table.Column<RemoteJobPlanDetailState> {...autoPlansColumnProps.planType} width={120} render={planTypeRender} />
      <Table.Column<RemoteJobPlanDetailState>
        {...autoPlansColumnProps.machineCount}
        width={100}
        render={mahcinesRender}
      />
      <Table.Column<RemoteJobPlanDetailState>
        {...autoPlansColumnProps.targetCount}
        width={100}
        render={targetsRender}
      />
      <Table.Column<RemoteJobPlanDetailState> {...autoPlansColumnProps.status} width={110} render={statusRender} />
      <Table.Column<RemoteJobPlanDetailState> {...autoPlansColumnProps.detail} width={110} render={detailRender} />
    </Table>
  );
});

export type AutoPlansColumnName =
  | 'planName'
  | 'description'
  | 'planType'
  | 'machineCount'
  | 'targetCount'
  | 'status'
  | 'detail';

const autoPlansColumnProps: TableColumnPropsType<RemoteJobPlanDetailState, AutoPlansColumnName> = {
  planName: {
    key: 'planName',
    title: <TableColumnTitle>Plan Name</TableColumnTitle>,
    dataIndex: 'planName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'planName'),
    },
  },
  description: {
    key: 'description',
    title: <TableColumnTitle>Description</TableColumnTitle>,
    dataIndex: 'description',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'description'),
    },
  },
  planType: {
    key: 'plan_type',
    title: <TableColumnTitle>Type</TableColumnTitle>,
    dataIndex: 'planType',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'planType'),
    },
  },
  machineCount: {
    key: 'machines',
    title: <TableColumnTitle>Machines</TableColumnTitle>,
    dataIndex: 'machineCount',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'machineCount'),
    },
  },
  targetCount: {
    key: 'targets',
    title: <TableColumnTitle>Targets</TableColumnTitle>,
    dataIndex: 'targetCount',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'targetCount'),
    },
  },
  status: {
    key: 'status',
    title: <TableColumnTitle>Status</TableColumnTitle>,
    dataIndex: 'status',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'status'),
    },
  },
  detail: {
    key: 'detail',
    title: <TableColumnTitle>Detail</TableColumnTitle>,
    dataIndex: 'detail',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'detail'),
    },
  },
};

const ErrorDetailPopup = React.memo(function ErrorDetailPopupMemo({
  error,
  measure,
}: {
  error: string;
  measure: string;
}) {
  return (
    <div>
      <div>• Error</div>
      <p
        css={css`
          white-space: pre-line;
        `}
      >
        {error}
      </p>
      <p />
      <div>• Detail</div>
      <p
        css={css`
          white-space: pre-line;
        `}
      >
        {measure}
      </p>
    </div>
  );
});

const getErrorDetailColor = (value: PlanStatusType): string =>
  ({
    ['registered']: '#d9d9d9',
    ['collecting']: 'blue',
    ['collected']: 'green',
    ['suspended']: 'red',
    ['halted']: 'red',
    ['completed']: '#d9d9d9',
  }[value] ?? '#d9d9d9');

const getPlanType = (value: string): string =>
  ({
    ftp: 'FTP',
    vftp_comapt: 'VFTP(COMPAT)',
    vftp_sss: 'VFP(SSS)',
  }[value] ?? '-');
