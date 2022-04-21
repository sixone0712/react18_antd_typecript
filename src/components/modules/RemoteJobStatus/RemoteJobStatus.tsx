import { blue } from '@ant-design/colors';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Space, Table, Tooltip } from 'antd';
import { TableLocale } from 'antd/lib/table/interface';
import React, { useCallback, useMemo } from 'react';
import useRemoteJobStatus from '../../../hooks/remoteJobStatus/useRemoteJobStatus';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { JobType, RemoteJobLastResultDate, RemoteJobStatusState } from '../../../types/Job';
import { CommonTableEmpty } from '../../atoms/Common/Common';
import CustomBadgeSync from '../../atoms/CustomBadge/CustomBadgeSync';
import CustomIcon from '../../atoms/CustomIcon';
import TableTitle from '../../atoms/TableTitle';

export type RemoteJobStatusProps = {};

export default function RemoteJobStatus({}: RemoteJobStatusProps): JSX.Element {
  const {
    data,
    isError,
    loggedInUser,
    openStartStopModal,
    openDeleteModal,
    openEditeModal,
    moveToRemoteJobAdd,
    moveToRemoteJobStep,
    moveToHistory,
  } = useRemoteJobStatus();

  const dataLen = useMemo(() => data?.length ?? 0, [data]);
  const indexRender = useCallback((value: number, record: RemoteJobStatusState, index: number) => {
    return value + 1;
  }, []);

  const jobNameRender = useCallback(
    (value: string, record: RemoteJobStatusState, index: number) => {
      const { jobId, jobName } = record;
      return (
        <div>
          <div className="value" css={iconStyle()} onClick={() => moveToRemoteJobStep({ jobId, jobName })}>
            {value}
          </div>
        </div>
      );
    },
    [moveToRemoteJobStep]
  );

  const lastResultRender = useCallback(
    (value: RemoteJobLastResultDate, record: RemoteJobStatusState, index: number) => {
      const lastResult = value.key === 'lastSuccess' ? record.lastSuccess : record.lastFailure;

      if (!lastResult) {
        return <div>-</div>;
      }

      const historyParams = {
        type: 'remote' as JobType,
        stepType: lastResult.stepType,
        jobId: record.jobId,
        jobName: record.jobName,
        stepId: lastResult.stepId,
        stepName: lastResult.stepName,
        historyId: lastResult.historyId,
      };

      return (
        <Space>
          <div css={iconStyle(Boolean(true))}>
            <div className="value" onClick={() => moveToHistory(historyParams)}>
              <div>{lastResult.date}</div>
              <div>{lastResult.stepName}</div>
            </div>
          </div>
          {lastResult.error && lastResult.error.length > 0 && (
            <Tooltip
              placement="top"
              title={lastResult.error.map((item) => (
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

  const statusRender = useCallback(
    (value: boolean, record: RemoteJobStatusState, index: number) => {
      const { jobId, jobName, stop: prevStop } = record;
      if (value)
        return (
          <div css={statusIconStyle(loggedInUser.roles.isRoleJob)}>
            <CustomIcon className="stopped" name="stop" />
            <span className="text" onClick={() => openStartStopModal({ action: 'start', jobId, jobName, prevStop })}>
              Stopped
            </span>
          </div>
        );
      else
        return (
          <div
            css={statusIconStyle(loggedInUser.roles.isRoleJob)}
            onClick={() => openStartStopModal({ action: 'stop', jobId, jobName, prevStop })}
          >
            <CustomIcon className="running" name="play" />
            <span className="text">Running</span>
          </div>
        );
    },
    [loggedInUser, openStartStopModal]
  );

  const editRender = useCallback(
    (value: number, record: RemoteJobStatusState, index: number) => {
      const { jobId, siteId, jobName, stop: prevStop } = record;
      return loggedInUser.roles.isRoleJob ? (
        <EditOutlined css={iconStyle()} onClick={() => openEditeModal({ jobId, siteId, jobName, prevStop })} />
      ) : (
        <div>-</div>
      );
    },
    [loggedInUser, openEditeModal]
  );

  const deleteRender = useCallback(
    (value: number, record: RemoteJobStatusState, index: number) => {
      const { jobId, jobName, stop: prevStop } = record;
      return loggedInUser.roles.isRoleJob ? (
        <DeleteOutlined css={iconStyle()} onClick={() => openDeleteModal({ jobId, jobName, prevStop })} />
      ) : (
        <div>-</div>
      );
    },
    [loggedInUser, openDeleteModal]
  );

  const renderTitle = useCallback(() => {
    const btn1 = {
      icon: <PlusOutlined />,
      // toolTip: 'Add',
      onClick: moveToRemoteJobAdd,
      name: 'Add',
    };

    return (
      <TableTitle
        title={
          <Space size={2}>
            <Badge color="blue" />
            <div>{`Registered Remote Jobs : ${dataLen}`}</div>
          </Space>
        }
        component={<CustomBadgeSync size="1.25rem" color={isError ? 'gray' : 'green'} marginRight="0.5rem" />}
        btn1={btn1}
      />
    );
  }, [dataLen, moveToRemoteJobAdd, isError]);

  const tableLocale = useMemo<TableLocale>(
    () => ({
      emptyText: <CommonTableEmpty isError={isError} />,
    }),
    [isError]
  );

  return (
    <div css={style}>
      <>
        {/* <Table<RemoteJobStatusState>
          rowKey={'jobId'}
          dataSource={data}
          bordered
          title={renderTitle}
          size="middle"
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
          }}
          css={tableStyle}
          locale={tableLocale}
        >
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.index} render={indexRender} />
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.jobName} render={jobNameRender} />
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.companyFabName} />
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.lastSuccessDate} render={lastResultRender} />
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.lastFailureDate} render={lastResultRender} />
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.stop} render={statusRender} />
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.edit} render={editRender} />
          <Table.Column<RemoteJobStatusState> {...remoteColumnProps.delete} render={deleteRender} />
        </Table> */}
        <RemoteJobStatusTable
          data={data}
          tableLocale={tableLocale}
          renderTitle={renderTitle}
          indexRender={indexRender}
          jobNameRender={jobNameRender}
          lastResultRender={lastResultRender}
          statusRender={statusRender}
          editRender={editRender}
          deleteRender={deleteRender}
        />
      </>
    </div>
  );
}

interface RemoteJobStatusTableProps {
  data: RemoteJobStatusState[] | undefined;
  tableLocale: TableLocale;
  renderTitle: () => JSX.Element;
  indexRender: (value: number, record: RemoteJobStatusState, index: number) => number;
  jobNameRender: (value: string, record: RemoteJobStatusState, index: number) => JSX.Element;
  lastResultRender: (value: RemoteJobLastResultDate, record: RemoteJobStatusState, index: number) => JSX.Element;
  statusRender: (value: boolean, record: RemoteJobStatusState, index: number) => JSX.Element;
  editRender: (value: number, record: RemoteJobStatusState, index: number) => JSX.Element;
  deleteRender: (value: number, record: RemoteJobStatusState, index: number) => JSX.Element;
}
const RemoteJobStatusTable = React.memo(function RemoteJobStatusTableMemo({
  data,
  renderTitle,
  indexRender,
  jobNameRender,
  lastResultRender,
  statusRender,
  editRender,
  deleteRender,
  tableLocale,
}: RemoteJobStatusTableProps): JSX.Element {
  return (
    <Table<RemoteJobStatusState>
      rowKey={'jobId'}
      dataSource={data}
      bordered
      title={renderTitle}
      size="middle"
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
      css={tableStyle}
      locale={tableLocale}
      tableLayout="fixed"
    >
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.index} render={indexRender} />
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.jobName} render={jobNameRender} />
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.companyFabName} />
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.lastSuccessDate} render={lastResultRender} />
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.lastFailureDate} render={lastResultRender} />
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.stop} render={statusRender} />
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.edit} render={editRender} />
      <Table.Column<RemoteJobStatusState> {...remoteColumnProps.delete} render={deleteRender} />
    </Table>
  );
});

const style = css``;

const tableStyle = css`
  width: 86rem;
`;

export type RemoteJobStatusColumnName =
  | 'index'
  | 'jobName'
  | 'companyFabName'
  | 'lastSuccessDate'
  | 'lastFailureDate'
  | 'stop'
  | 'edit'
  | 'delete';

const remoteColumnProps: TableColumnPropsType<RemoteJobStatusState, RemoteJobStatusColumnName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    width: 90,
  },
  jobName: {
    key: 'jobName',
    title: <TableColumnTitle>Job Name</TableColumnTitle>,
    dataIndex: 'jobName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'jobName'),
    },
    width: 200,
  },
  companyFabName: {
    key: 'companyFabName',
    title: <TableColumnTitle>User-Fab Name</TableColumnTitle>,
    dataIndex: 'companyFabName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'companyFabName'),
    },
    width: 200,
  },
  lastSuccessDate: {
    key: 'lastSuccessDate',
    title: <TableColumnTitle>Last Success</TableColumnTitle>,
    dataIndex: 'lastSuccessDate',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a.lastSuccessDate, b.lastSuccessDate, 'date'),
    },
    width: 289,
  },
  lastFailureDate: {
    key: 'lastFailureDate',
    title: <TableColumnTitle>Last Failure</TableColumnTitle>,
    dataIndex: 'lastFailureDate',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a.lastFailureDate, b.lastFailureDate, 'date'),
    },
    width: 289,
  },
  stop: {
    key: 'stop',
    title: <TableColumnTitle>Status</TableColumnTitle>,
    dataIndex: 'stop',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'stop'),
    },
    width: 120,
  },
  edit: {
    key: 'edit',
    title: <TableColumnTitle>Edit</TableColumnTitle>,
    dataIndex: 'jobId',
    align: 'center',
    width: 85,
  },
  delete: {
    key: 'delete',
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    dataIndex: 'jobId',
    align: 'center',
    width: 85,
  },
};

const statusIconStyle = (isJob: boolean) => css`
  pointer-events: ${!isJob && 'none'};
  .running {
    color: #52c41a;
    -webkit-animation: blink 1s ease-in-out infinite alternate;
    animation: blink 1s ease-in-out infinite alternate;
    @keyframes blink {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }

  .stopped {
    color: #ff4d4f;
  }
  .text {
    cursor: ${isJob ? 'pointer' : 'default'};
    &:hover {
      color: ${isJob && blue[4]};
    }
    &:active {
      color: ${isJob && blue[6]};
    }
    margin-left: 0.3rem;
  }
`;

const iconStyle = (enable = true) => css`
  ${enable
    ? css`
        cursor: pointer;
        &:hover {
          color: ${blue[4]};
        }
        &:active {
          color: ${blue[6]};
        }
      `
    : css`
        cursor: not-allowed;
        .value {
          pointer-events: none;
        }
      `}
`;

const errorIconStyle = css`
  color: #ff4d4f;
  &:hover {
    color: #cf1322;
  }
`;
