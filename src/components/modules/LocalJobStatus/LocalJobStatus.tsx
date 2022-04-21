import { blue } from '@ant-design/colors';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Space, Table, Tooltip } from 'antd';
import { TableLocale } from 'antd/lib/table/interface';
import React, { useCallback, useMemo } from 'react';
import useLocalJobStatus from '../../../hooks/localJobStatus/useLocalJobStatus';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { JobStatusType, JobStepType, LocalJobStatusState } from '../../../types/Job';
import { CommonTableEmpty } from '../../atoms/Common/Common';
import CustomBadgeSync from '../../atoms/CustomBadge/CustomBadgeSync';
import CustomIcon from '../../atoms/CustomIcon';
import PopupTip from '../../atoms/PopupTip';
import StatusBadge from '../../atoms/StatusBadge';
import TableTitle from '../../atoms/TableTitle';

export type LocalJobStatusProps = {};

export default function LocalJobStatus({}: LocalJobStatusProps): JSX.Element {
  const { data, isError, openDeleteModal, loggedInUser, moveToAdd, moveToHistory } = useLocalJobStatus();

  const renderNumber = useCallback((value: number, record: LocalJobStatusState, index: number) => value + 1, []);

  const renderStatus = useCallback(
    (value: JobStatusType, record: LocalJobStatusState, index: number) => {
      const { jobId, stepId, stepType, historyId } = record;
      const errorMsg = record.status === 'failure' && record.error && record.error.length > 0 ? record.error : [];

      return (
        <Space>
          <StatusBadge
            type={value}
            onClick={() =>
              moveToHistory({
                type: 'local',
                stepType: stepType as JobStepType,
                jobId: jobId as number,
                stepId: stepId as number,
                historyId,
              })
            }
          />
          {errorMsg.length > 0 && (
            <Tooltip
              placement="top"
              title={errorMsg.map((item) => (
                <div key={item}>{item}</div>
              ))}
              color="red"
            >
              <CustomIcon css={errorIconStyle} name="warning" />
              {/* it need to diplay tooltip */}
              <div></div>
            </Tooltip>
          )}
        </Space>
      );
    },
    [moveToHistory]
  );

  const deleteRender = useCallback(
    (value: LocalJobStatusState, record: LocalJobStatusState, index: number) => {
      return loggedInUser.roles.isRoleJob ? (
        <DeleteOutlined css={iconStyle} onClick={() => openDeleteModal(value.jobId)} />
      ) : (
        <div>-</div>
      );
    },
    [openDeleteModal, loggedInUser]
  );

  const renderTitle = useCallback(() => {
    const btn1 = {
      icon: <PlusOutlined />,
      // toolTip: 'Add',
      onClick: moveToAdd,
      name: 'Add',
    };

    return (
      <TableTitle
        component={<CustomBadgeSync size="1.25rem" color={isError ? 'gray' : 'green'} marginRight="0.5rem" />}
        btn1={btn1}
      />
    );
  }, [moveToAdd, isError]);

  const filesRender = useCallback((value: string[], record: LocalJobStatusState, index: number) => {
    return PopupTip({ value: `${value.length} files`, list: value });
  }, []);

  const dateRender = useCallback((value: string, record: LocalJobStatusState, index: number) => {
    return <div>{value}</div>;
  }, []);

  const tableLocale = useMemo<TableLocale>(
    () => ({
      emptyText: <CommonTableEmpty isError={isError} />,
    }),
    [isError]
  );

  return (
    // <Table<LocalJobStatusState>
    //   rowKey={'jobId'}
    //   dataSource={data ?? []}
    //   bordered
    //   title={renderTitle}
    //   size="middle"
    //   pagination={{
    //     position: ['bottomCenter'],
    //     showSizeChanger: true,
    //   }}
    //   css={tableStyle}
    //   locale={tableLocale}
    // >
    //   <Table.Column<LocalJobStatusState> {...localColumnProps.index} render={renderNumber} />
    //   <Table.Column<LocalJobStatusState> {...localColumnProps.companyFabName} />
    //   <Table.Column<LocalJobStatusState> {...localColumnProps.fileOriginalNames} render={filesRender} />
    //   <Table.Column<LocalJobStatusState> {...localColumnProps.status} render={renderStatus} />
    //   <Table.Column<LocalJobStatusState> {...localColumnProps.registeredDate} render={dateRender} />
    //   <Table.Column<LocalJobStatusState> {...localColumnProps.delete} render={deleteRender} />
    // </Table>
    <LocalJobStatusTable
      data={data}
      tableLocale={tableLocale}
      renderTitle={renderTitle}
      renderNumber={renderNumber}
      filesRender={filesRender}
      renderStatus={renderStatus}
      dateRender={dateRender}
      deleteRender={deleteRender}
    />
  );
}

interface LocalJobStatusTableProps {
  data: LocalJobStatusState[] | undefined;
  tableLocale: TableLocale;
  renderTitle: () => JSX.Element;
  renderNumber: (value: number, record: LocalJobStatusState, index: number) => number;
  filesRender: (value: string[], record: LocalJobStatusState, index: number) => JSX.Element;
  renderStatus: (value: JobStatusType, record: LocalJobStatusState, index: number) => JSX.Element;
  dateRender: (value: string, record: LocalJobStatusState, index: number) => JSX.Element;
  deleteRender: (value: LocalJobStatusState, record: LocalJobStatusState, index: number) => JSX.Element;
}

const LocalJobStatusTable = React.memo(function LocalJobStatusTableMemo({
  data,
  tableLocale,
  renderTitle,
  renderNumber,
  filesRender,
  renderStatus,
  dateRender,
  deleteRender,
}: LocalJobStatusTableProps) {
  return (
    <Table<LocalJobStatusState>
      rowKey={'jobId'}
      dataSource={data ?? []}
      bordered
      title={renderTitle}
      size="small"
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
      css={tableStyle}
      locale={tableLocale}
      tableLayout="fixed"
    >
      <Table.Column<LocalJobStatusState> {...localColumnProps.index} render={renderNumber} />
      <Table.Column<LocalJobStatusState> {...localColumnProps.jobName} />
      <Table.Column<LocalJobStatusState> {...localColumnProps.companyFabName} />
      <Table.Column<LocalJobStatusState> {...localColumnProps.fileOriginalNames} render={filesRender} />
      <Table.Column<LocalJobStatusState> {...localColumnProps.status} render={renderStatus} />
      <Table.Column<LocalJobStatusState> {...localColumnProps.registeredDate} render={dateRender} />
      <Table.Column<LocalJobStatusState> {...localColumnProps.delete} render={deleteRender} />
    </Table>
  );
});

export type LocalJobStatusColumnName =
  | 'index'
  | 'jobName'
  | 'companyFabName'
  | 'status'
  | 'fileOriginalNames'
  | 'registeredDate'
  | 'delete';

const localColumnProps: TableColumnPropsType<LocalJobStatusState, LocalJobStatusColumnName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    width: 106,
  },
  jobName: {
    key: 'jobName',
    title: <TableColumnTitle>Job Name</TableColumnTitle>,
    dataIndex: 'jobName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'jobName'),
    },
    width: 260,
  },
  companyFabName: {
    key: 'companyFabName',
    title: <TableColumnTitle>User-Fab Name</TableColumnTitle>,
    dataIndex: 'companyFabName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'companyFabName'),
    },
    width: 260,
  },
  status: {
    key: 'status',
    title: <TableColumnTitle>Convert & Insert</TableColumnTitle>,
    dataIndex: 'status',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'status'),
    },
    width: 200,
  },
  fileOriginalNames: {
    key: 'files',
    title: <TableColumnTitle>Files</TableColumnTitle>,
    dataIndex: 'fileOriginalNames',
    align: 'center',
    width: 200,
  },
  registeredDate: {
    key: 'registeredDate',
    title: <TableColumnTitle>Date</TableColumnTitle>,
    dataIndex: 'registeredDate',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'registeredDate'),
    },
    width: 250,
  },
  delete: {
    key: 'jobId',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    align: 'center',
    width: 100,
  },
};

const tableStyle = css`
  width: 86rem;
`;

const iconStyle = css`
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

const errorIconStyle = css`
  color: #ff4d4f;
  &:hover {
    color: #cf1322;
  }
`;
