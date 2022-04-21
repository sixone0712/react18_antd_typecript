import { blue } from '@ant-design/colors';
import { DownloadOutlined, ProfileOutlined, ReloadOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Drawer, Popconfirm, Space, Spin, Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { useCallback } from 'react';
import useErrorLogDownloadList from '../../../../hooks/errorLog/useErrorLogDownloadList';
import { TableColumnTitle } from '../../../../lib/util/commonStyle';
import { compareTableItem } from '../../../../lib/util/compareTableItem';
import { convertRemToPixels } from '../../../../lib/util/remToPixcels';
import { TableColumnPropsType } from '../../../../types/common';
import { ErrorLogDownloadTable, PLAN_FTP_TYPE } from '../../../../types/errorLog';
import { JobStatusType } from '../../../../types/Job';
import CustomIcon from '../../../atoms/CustomIcon';
import { converStatusType } from '../../../atoms/StatusBadge/StatusBadge';
import ErrorLogTableHeader from '../ErrorLogTableHeader';
export type ErrorLogDownloadListProps = {};

export default function ErrorLogDownloadList({}: ErrorLogDownloadListProps): JSX.Element {
  const { visible, onClose, data, isFetching, onClickRefresh, onClickDownload } = useErrorLogDownloadList();
  const requestDateRender = useCallback((value: string, record: ErrorLogDownloadTable, index: number) => {
    const date = value.split('~');

    return (
      <div>
        <div>{`${moment(date[0], 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}`}</div>
        <div>{`- ${moment(date[1], 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')}`}</div>
      </div>
    );
  }, []);

  const typeRender = useCallback((value: PLAN_FTP_TYPE, record: ErrorLogDownloadTable, index: number) => {
    const { command } = record;
    let render;

    if (value === 'FTP') {
      render = command.split(',').map((item) => <div key={item}>{item.trim()}</div>);
    } else {
      render = command;
    }

    return (
      <Tooltip
        title={
          <div>
            <div>{value === 'FTP' ? '[Log Name]' : '[Command]'}</div>
            {render}
          </div>
        }
        placement="right"
      >
        <div css={downloadStyle(true)}>
          <Space>
            <div>{value}</div>
            <ProfileOutlined />
          </Space>
        </div>
      </Tooltip>
    );
  }, []);

  const statusRender = useCallback((value: JobStatusType, record: ErrorLogDownloadTable, index: number) => {
    const { textStatus, badgeStatus } = converStatusType(value);

    return (
      <Space>
        <Badge status={badgeStatus} text={textStatus} />
        {record.error && value === 'failure' && (
          <Tooltip placement="top" title={record.error} color="red">
            <CustomIcon
              css={css`
                color: red;
              `}
              name="warning"
            />
            {/* it need to diplay tooltip */}
            <div></div>
          </Tooltip>
        )}
      </Space>
    );
  }, []);

  const titleRender = useCallback(() => {
    const btn1 = {
      icon: <ReloadOutlined />,
      toolTip: 'Refresh',
      onClick: onClickRefresh,
    };

    return <ErrorLogTableHeader title={`Registered Download List : ${data?.length ?? 0}`} btn1={btn1} />;
  }, [data, onClickRefresh]);

  const renderDownload = useCallback(
    (value: number, record: ErrorLogDownloadTable, index: number) => {
      const { status, download_id } = record;

      return (
        <div>
          <Popconfirm
            title="Are you sure to download?"
            onConfirm={() => onClickDownload(download_id)}
            okText="Yes"
            cancelText="No"
            placement="left"
            disabled={Boolean(status !== 'success')}
          >
            {status === 'processing' && <Spin />}
            {status === 'failure' && (
              <div key={value} css={downloadStyle(false)}>
                -
              </div>
            )}
            {status === 'success' && <DownloadOutlined key={value} css={downloadStyle(true)} />}
          </Popconfirm>
        </div>
      );
    },
    [onClickDownload]
  );

  return (
    <div css={style}>
      <Drawer
        title={
          <Space>
            <UnorderedListOutlined />
            <div>Downloaded File List</div>
          </Space>
        }
        placement="right"
        width={convertRemToPixels(84.25)}
        closable={true}
        onClose={onClose}
        visible={visible}
        destroyOnClose={true}
        // getContainer={false}
        forceRender
      >
        <Table<ErrorLogDownloadTable>
          rowKey={'index'}
          dataSource={data}
          bordered
          title={titleRender}
          size="middle"
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
          }}
          loading={isFetching}
          css={tableStyle}
          tableLayout="fixed"
        >
          <Table.Column<ErrorLogDownloadTable> {...columnProps.index} width={80} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.error_code} width={120} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.equipment_name} width={170} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.occurred_date} width={170} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.device} width={120} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.process} width={120} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.type} width={130} render={typeRender} />
          {/* <Table.Column<ErrorLogDownloadTable> {...columnProps.command} width={500} /> */}
          <Table.Column<ErrorLogDownloadTable> {...columnProps.start_end} render={requestDateRender} width={180} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.status} width={110} render={statusRender} />
          <Table.Column<ErrorLogDownloadTable> {...columnProps.download} width={90} render={renderDownload} />
        </Table>
      </Drawer>
    </div>
  );
}

const style = css``;

const tableStyle = css`
  /* width: 86rem; */
`;

const downloadStyle = (valid: boolean) => css`
  ${valid &&
  css`
    &:hover {
      color: ${blue[4]};
    }
    &:active {
      color: ${blue[6]};
    }
  `}

  ${!valid &&
  css`
    color: gray;
    cursor: not-allowed !important;
    svg {
      pointer-events: none;
    }
  `}
`;

type ErrorLogColumnDownloadName =
  | 'index'
  | 'error_code'
  | 'equipment_name'
  | 'occurred_date'
  | 'device'
  | 'process'
  | 'type'
  | 'start_end'
  | 'command'
  | 'status'
  | 'download';

const columnProps: TableColumnPropsType<ErrorLogDownloadTable, ErrorLogColumnDownloadName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    // fixed가 설정된 Column에는 shouldCellUpdate를 설정하면 않된다.
    // shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },
  error_code: {
    key: 'error_code',
    title: <TableColumnTitle>Error Code</TableColumnTitle>,
    dataIndex: 'error_code',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'error_code'),
    },
    // fixed가 설정된 Column에는 shouldCellUpdate를 설정하면 않된다.
    // shouldCellUpdate: (cur, prev) => cur.error_code !== prev.error_code,
  },
  equipment_name: {
    key: 'equipment_name',
    title: <TableColumnTitle>Equipment Name</TableColumnTitle>,
    dataIndex: 'equipment_name',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'equipment_name'),
    },
    // fixed가 설정된 Column에는 shouldCellUpdate를 설정하면 않된다.
    // shouldCellUpdate: (cur, prev) => cur.error_code !== prev.error_code,
  },
  occurred_date: {
    key: 'occurred_date',
    title: <TableColumnTitle>Occurred Date</TableColumnTitle>,
    dataIndex: 'occurred_date',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'occurred_date'),
    },
    //shouldCellUpdate: (cur, prev) => cur.occurred_date !== prev.occurred_date,
  },
  device: {
    key: 'device',
    title: <TableColumnTitle>Device</TableColumnTitle>,
    dataIndex: 'device',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'device'),
    },
    //shouldCellUpdate: (cur, prev) => cur.occurred_date !== prev.occurred_date,
  },
  process: {
    key: 'process',
    title: <TableColumnTitle>Process</TableColumnTitle>,
    dataIndex: 'process',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'process'),
    },
    //shouldCellUpdate: (cur, prev) => cur.occurred_date !== prev.occurred_date,
  },
  type: {
    key: 'type',
    title: <TableColumnTitle>Type</TableColumnTitle>,
    dataIndex: 'type',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'type'),
    },
    //shouldCellUpdate: (cur, prev) => cur.type !== prev.type,
  },
  command: {
    key: 'start_end',
    title: <TableColumnTitle>Log Name/Command</TableColumnTitle>,
    dataIndex: 'command',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'command'),
    },
    //shouldCellUpdate: (cur, prev) => cur.command !== prev.command,
  },
  start_end: {
    key: 'start_end',
    title: <TableColumnTitle>Request Date</TableColumnTitle>,
    dataIndex: 'start_end',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'start_end'),
    },
    //shouldCellUpdate: (cur, prev) => cur.start_end !== prev.start_end,
  },
  status: {
    key: 'status',
    title: <TableColumnTitle>Status</TableColumnTitle>,
    dataIndex: 'status',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'status'),
    },
    //shouldCellUpdate: (cur, prev) => cur.status !== prev.status,
  },
  download: {
    key: 'download',
    title: <TableColumnTitle>Download</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    //shouldCellUpdate: (cur, prev) => cur.id !== prev.id,
  },
};
