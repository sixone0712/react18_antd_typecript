import { blue } from '@ant-design/colors';
import { CheckOutlined, HistoryOutlined, TagOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Popconfirm, Space, Table, Tooltip } from 'antd';
import { TableLocale } from 'antd/lib/table/interface';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import React, { useCallback, useMemo } from 'react';
import useRemoteJobStatusStepList from '../../../hooks/remoteJobStatus/useRemoteJobStatusStepList';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import {
  AVAILABLE_MANUAL_EXCUTE_STEPS,
  JobModeType,
  JobStatusType,
  JobStepType,
  RemoteJobLastResultDate,
  RemoteJobStepStatus,
} from '../../../types/Job';
import { CommonTableEmpty } from '../../atoms/Common/Common';
import CustomBadgeSync from '../../atoms/CustomBadge/CustomBadgeSync';
import CustomIcon from '../../atoms/CustomIcon';
import TableTitle from '../../atoms/TableTitle';
import StepMilestoneModal from '../Common/Modal/StepMilestoneModal';
import { convertStepType } from '../RemoteJob/Drawer/RemoteJobStepsDrawerCommon';
import { convertExcuteMode } from '../RemoteJob/RemoteJobSteps';

export type RemoteJobStatusStepListProps = {};

export default function RemoteJobStatusStepList({}: RemoteJobStatusStepListProps): JSX.Element {
  const {
    data,
    isError,
    loggedInUser,
    status,
    isMilestone,
    setMilestone,
    stepMilestone,
    executeManualStep,
    moveToHistory,
  } = useRemoteJobStatusStepList();

  const dataLen = useMemo(() => data?.length ?? 0, [data]);
  const renderTitle = useCallback((): JSX.Element => {
    const btn1 = {
      icon: <HistoryOutlined />,
      // toolTip: 'Milestone',
      onClick: () => setMilestone(true),
      name: 'Milestone',
    };
    return (
      <TableTitle
        title={
          <Space size={2}>
            <Badge color="blue" />
            <div>{`Registered Remote Job Steps : ${dataLen}`}</div>
          </Space>
        }
        component={<CustomBadgeSync size="1.25rem" color={isError ? 'gray' : 'green'} marginRight="0.5rem" />}
        btn1={btn1}
      />
    );
  }, [dataLen, isError, setMilestone]);

  const renderEnable = useCallback((value: boolean, record: RemoteJobStepStatus, index: number) => {
    return value ? (
      <CheckOutlined
        css={css`
          color: #1890ff;
        `}
      />
    ) : undefined;
  }, []);

  const renderStatus = useCallback(
    (value: JobStatusType, record: RemoteJobStepStatus, index: number) => {
      const { badgeStatus, textStatus } = convertBadgeProps(value);
      return (
        <div
          onClick={() =>
            moveToHistory({
              type: 'remote',
              jobId: record.jobId as number,
              stepId: record.stepId as number,
              stepType: record.stepType as JobStepType,
              stepName: record.stepName as string,
            })
          }
          css={css`
            .ant-badge-status-text {
              ${iconStyle(true)}
            }
          `}
        >
          <Badge status={badgeStatus} text={textStatus} />
        </div>
      );
    },
    [moveToHistory]
  );

  const renderStepType = useCallback((value: JobStepType, record: RemoteJobStepStatus, index: number) => {
    return <div>{convertStepType(value)}</div>;
  }, []);

  const renderExecuteMode = useCallback(
    (value: JobModeType, record: RemoteJobStepStatus, index: number) => {
      let title: React.ReactNode = null;

      switch (value) {
        case 'time':
          title = record.time ? (
            <>
              {record.time.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </>
          ) : null;
          break;
        case 'cycle':
          title = `${record.period} ${record.cycle}` ?? null;
          break;
        case 'pre':
          title = data ? data.find((item) => item.uuid === record.preStep)?.stepName ?? null : null;
          break;
        case 'next':
          title = data ? data.find((item) => item.uuid === record.nextStep)?.stepName ?? null : null;
          break;
        case 'none':
        default:
          break;
      }

      return (
        <Tooltip placement="right" title={title}>
          {convertExcuteMode(value)}
        </Tooltip>
      );
    },
    [data]
  );

  const renderLast = useCallback((value: RemoteJobLastResultDate, record: RemoteJobStepStatus, index: number) => {
    const lastResult = value.key === 'lastSuccess' ? record.lastSuccess : record.lastFailure;

    if (!lastResult) {
      return <div>-</div>;
    }

    return (
      <Space>
        <div
          css={iconStyle(true)}
          onClick={() =>
            moveToHistory({
              type: 'remote',
              jobId: record.jobId as number,
              stepId: record.stepId as number,
              stepType: record.stepType as JobStepType,
              stepName: record.stepName as string,
              historyId: lastResult.historyId as string,
            })
          }
        >
          {lastResult.date}
        </div>
        {lastResult.error.length > 0 && (
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
  }, []);

  const renderManual = useCallback(
    (value: number, record: RemoteJobStepStatus, index: number) => {
      const { jobId, stepId, stepName } = record;

      if (!AVAILABLE_MANUAL_EXCUTE_STEPS.includes(record.stepType)) {
        return (
          <Tooltip title="This step does not support Manual Execute." placement="right" color="gray">
            <div
              css={css`
                color: gray;
                cursor: not-allowed !important;
              `}
            >
              -
            </div>
          </Tooltip>
        );
      }

      return (
        <Popconfirm
          title="Are you sure to execute manual job?"
          okText="Excute"
          // okButtonProps={{ type: 'primary', disabled: (status?.stop ?? true) || !loggedInUser.roles.isRoleJob }}
          okButtonProps={{ type: 'primary', disabled: !loggedInUser.roles.isRoleJob }}
          onConfirm={() => executeManualStep({ jobId, stepId, stepName })}
        >
          <TagOutlined css={iconStyle()} />
        </Popconfirm>
      );
    },
    // [loggedInUser, status, excuteManualStep]
    [loggedInUser, executeManualStep]
  );

  const tableLocale = useMemo<TableLocale>(
    () => ({
      emptyText: <CommonTableEmpty isError={isError} />,
    }),
    [isError]
  );

  return (
    <div css={style}>
      {/* <Table<RemoteJobStepStatus>
        rowKey={'index'}
        dataSource={data ?? []}
        bordered
        title={renderTitle}
        size="small"
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
        }}
        tableLayout="fixed"
        locale={tableLocale}
      >
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.enable} render={renderEnable} />
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.status} render={renderStatus} />
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.stepName} />
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.stepType} render={renderStepType} />
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.excuteMode} render={renderExcuteMode} />
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.lastSuccessDate} render={renderLast} />
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.lastFailureDate} render={renderLast} />
        <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.excute} render={renderManual} />
      </Table> */}
      <RemoteJobStatusStepListTable
        data={data}
        tableLocale={tableLocale}
        renderTitle={renderTitle}
        renderEnable={renderEnable}
        renderStatus={renderStatus}
        renderStepType={renderStepType}
        renderExecuteMode={renderExecuteMode}
        renderLast={renderLast}
        renderManual={renderManual}
      />
      <StepMilestoneModal steps={stepMilestone} visible={isMilestone} setVisible={setMilestone} />
    </div>
  );
}

interface RemoteJobStatusStepListTableProps {
  data: RemoteJobStepStatus[] | undefined;
  tableLocale: TableLocale;
  renderTitle: () => JSX.Element;
  renderEnable: (value: boolean, record: RemoteJobStepStatus, index: number) => JSX.Element | undefined;
  renderStatus: (value: JobStatusType, record: RemoteJobStepStatus, index: number) => JSX.Element;
  renderStepType: (value: JobStepType, record: RemoteJobStepStatus, index: number) => JSX.Element;
  renderExecuteMode: (value: JobModeType, record: RemoteJobStepStatus, index: number) => JSX.Element;
  renderLast: (value: RemoteJobLastResultDate, record: RemoteJobStepStatus, index: number) => JSX.Element;
  renderManual: (value: number, record: RemoteJobStepStatus, index: number) => JSX.Element;
}

const RemoteJobStatusStepListTable = React.memo(function RemoteJobStatusStepListMemo({
  data,
  tableLocale,
  renderTitle,
  renderEnable,
  renderStatus,
  renderStepType,
  renderExecuteMode,
  renderLast,
  renderManual,
}: RemoteJobStatusStepListTableProps) {
  return (
    <Table<RemoteJobStepStatus>
      rowKey={'index'}
      dataSource={data ?? []}
      bordered
      title={renderTitle}
      size="small"
      pagination={{
        position: ['bottomCenter'],
        showSizeChanger: true,
      }}
      tableLayout="fixed"
      locale={tableLocale}
    >
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.enable} render={renderEnable} />
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.status} render={renderStatus} />
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.stepName} />
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.stepType} render={renderStepType} />
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.executeMode} render={renderExecuteMode} />
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.lastSuccessDate} render={renderLast} />
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.lastFailureDate} render={renderLast} />
      <Table.Column<RemoteJobStepStatus> {...remoteStepColumnProps.excute} render={renderManual} />
    </Table>
  );
});

const style = css`
  margin-top: 1rem;
  width: 64rem;
  .ant-table {
    .ant-table-tbody {
      .ant-table-cell.stepName,
      .ant-table-cell.stepType,
      .ant-table-cell.mode {
        cursor: default;
      }
    }
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

export type RemoteJobStatusStepColumnName =
  | 'enable'
  | 'status'
  | 'stepName'
  | 'stepType'
  | 'executeMode'
  | 'lastSuccessDate'
  | 'lastFailureDate'
  | 'excute';

const remoteStepColumnProps: TableColumnPropsType<RemoteJobStepStatus, RemoteJobStatusStepColumnName> = {
  enable: {
    key: 'enable',
    title: <TableColumnTitle>Eanble</TableColumnTitle>,
    dataIndex: 'enable',
    className: 'enable',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'enable'),
    },
    width: 80,
  },
  status: {
    key: 'status',
    title: <TableColumnTitle>Status</TableColumnTitle>,
    dataIndex: 'status',
    className: 'status',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'status'),
    },
    width: 120,
  },
  stepName: {
    key: 'stepName',
    title: <TableColumnTitle>Step Name</TableColumnTitle>,
    dataIndex: 'stepName',
    className: 'stepName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'stepName'),
    },
    width: 200,
  },
  stepType: {
    key: 'stepType',
    title: <TableColumnTitle>Step Type</TableColumnTitle>,
    dataIndex: 'stepType',
    className: 'stepType',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'stepType'),
    },
    width: 160,
  },
  executeMode: {
    key: 'mode',
    title: <TableColumnTitle>Execute Mode</TableColumnTitle>,
    dataIndex: 'mode',
    className: 'mode',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'mode'),
    },
  },
  lastSuccessDate: {
    key: 'lastSuccessDate',
    title: <TableColumnTitle>Last Success</TableColumnTitle>,
    dataIndex: 'lastSuccessDate',
    className: 'lastSuccessDate',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a.lastSuccessDate, b.lastSuccessDate, 'date'),
    },
    width: 150,
  },
  lastFailureDate: {
    key: 'lastFailureDate',
    title: <TableColumnTitle>Last Failure</TableColumnTitle>,
    dataIndex: 'lastFailureDate',
    className: 'lastFailureDate',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a.lastFailureDate, b.lastFailureDate, 'date'),
    },
    width: 150,
  },
  excute: {
    key: 'execute',
    title: (
      <TableColumnTitle>
        <div>Manual</div>
        <div>Execute</div>
      </TableColumnTitle>
    ),
    dataIndex: 'stepId',
    className: 'execute',
    align: 'center',
    width: 80,
  },
};

export const convertBadgeProps = (
  type: JobStatusType
): { badgeStatus: PresetStatusColorType | undefined; textStatus: string } => {
  switch (type) {
    case 'success':
      return {
        badgeStatus: 'success',
        textStatus: 'Success',
      };

    case 'failure':
      return {
        badgeStatus: 'error',
        textStatus: 'Failure',
      };
    case 'processing':
      return {
        badgeStatus: 'processing',
        textStatus: 'Processing',
      };
    case 'canceled':
      return {
        badgeStatus: 'warning',
        textStatus: 'Canceled',
      };
    case 'notbuild':
      return {
        badgeStatus: 'default',
        textStatus: 'Not Build',
      };
    case 'nodata':
      return {
        badgeStatus: 'success',
        textStatus: 'No Data',
      };

    default:
      return { badgeStatus: undefined, textStatus: 'Unknown' };
  }
};

const errorIconStyle = css`
  color: #ff4d4f;
  &:hover {
    color: #cf1322;
  }
`;
