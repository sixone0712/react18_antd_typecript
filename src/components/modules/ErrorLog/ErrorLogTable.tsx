import { blue } from '@ant-design/colors';
import {
  DownloadOutlined,
  ExportOutlined,
  ImportOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Table, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { undraw_selection } from '../../../assets/images';
import useErrorLogTable from '../../../hooks/errorLog/useErrorLogTable';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { ErrorLogState } from '../../../types/errorLog';
import { V_SPACE } from '../../atoms/Space';
import ErrorLogTableHeader from './ErrorLogTableHeader';
import ErrorLogDownloadList from './Modal/ErrorLogDownloadList';
import ErrorLogDownloadRequest from './Modal/ErrorLogDownloadReqeust';
import ErrorLogImport from './Modal/ErrorLogImport';

export type ErrorLogTableProps = {};

export default function ErrorLogTable({}: ErrorLogTableProps): JSX.Element {
  const {
    errorCodeProps,
    errorMessageProps,
    equipmentNameProps,
    occurrenceCountProps,
    occurredDateProps,
    ppidProps,
    deviceProps,
    processProps,
    glassIdProps,
    lotIdProps,
    chuckProps,
    list,
    settingList,
    isFetching,
    siteInfo,
    searchDownloadItem,
    onClickReqDownload,
    onClickDownloadList,
    onClickImport,
    onClickExport,
    onClickRefresh,
  } = useErrorLogTable();

  const renderDownload = useCallback(
    (value: number, record: ErrorLogState, index: number) => {
      const searched = searchDownloadItem(record);

      if (searched) {
        return (
          <DownloadOutlined
            key={value}
            css={downloadStyle(true)}
            onClick={() => onClickReqDownload(record, searched)}
          />
        );
      } else {
        return (
          <Tooltip title="Not imported error code value" placement="right" color="gray">
            <div key={value} css={downloadStyle(false)} onClick={() => onClickReqDownload(record, searched)}>
              -
            </div>
          </Tooltip>
        );
      }
    },
    [searchDownloadItem, onClickReqDownload]
  );

  const titleRender = useCallback(() => {
    const btn1 = {
      icon: <UnorderedListOutlined />,
      // toolTip: 'Downloaded File List',
      onClick: onClickDownloadList,
      name: 'Downloaded File List',
    };

    const btn2 = {
      icon: <ImportOutlined />,
      toolTip: 'Import',
      onClick: onClickImport,
    };

    const btn3 = {
      icon: <ExportOutlined />,
      toolTip: 'Export',
      onClick: onClickExport,
      // disabled: Boolean(!settingList?.length),
    };

    const btn4 = {
      icon: <ReloadOutlined />,
      toolTip: 'Refresh',
      onClick: onClickRefresh,
    };

    return (
      <ErrorLogTableHeader
        title={
          <div>
            <div>{`- Registered Error List : ${list?.length ?? 0}`}</div>
            <div>{`- Imported Error Code : ${settingList?.length ?? 0}`}</div>
          </div>
        }
        btn1={btn1}
        btn2={btn2}
        btn3={btn3}
        btn4={btn4}
      />
    );
  }, [list, settingList, onClickDownloadList, onClickImport, onClickExport, onClickRefresh]);

  return (
    <div css={style}>
      <div className="error-log-title">
        <Badge color="blue" />
        <span>Error Log</span>
      </div>
      <div className="error-log-table">
        {siteInfo.siteId === null ? (
          <div className="no-selection">
            <img alt="select a user-fab name" src={undraw_selection} loading="lazy" />
            <V_SPACE />
            <div>Select a user-fab name.</div>
          </div>
        ) : (
          <Table<ErrorLogState>
            rowKey={'index'}
            dataSource={list}
            bordered
            title={titleRender}
            size="middle"
            pagination={{
              position: ['bottomCenter'],
              showSizeChanger: true,
            }}
            loading={isFetching}
            css={tableStyle}
            scroll={{ x: 'max-content' }}
            tableLayout="fixed"
          >
            <Table.Column<ErrorLogState> {...errorLogColumnProps.index} width={100} />
            <Table.Column<ErrorLogState> {...errorLogColumnProps.error_code} width={140} {...errorCodeProps} />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.equipment_name}
              width={200}
              // {...errorMessageProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.error_message}
              width={400}
              // {...equipmentNameProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.occurrence_count}
              width={120}
              // {...occurrenceCountProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.occurred_date}
              width={180}
              // {...occurredDateProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.ppid}
              width={100}
              // {...ppidProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.device}
              width={130}
              // {...deviceProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.process}
              width={130}
              // {...processProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.glass_id}
              width={200}
              // {...glassIdProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.lot_id}
              width={160}
              // {...lotIdProps}
            />
            <Table.Column<ErrorLogState>
              {...errorLogColumnProps.chuck}
              width={150}
              // {...chuckProps}
            />
            <Table.Column<ErrorLogState> {...errorLogColumnProps.download} width={100} render={renderDownload} />
          </Table>
        )}
      </div>
      <ErrorLogDownloadRequest />
      <ErrorLogDownloadList />
      <ErrorLogImport />
    </div>
  );
}

const style = css`
  display: flex;
  flex-direction: column;

  .error-log-table {
    margin-top: 1rem;
    padding-left: 1rem;
    .error-log-title {
      margin-bottom: 2rem;
    }
    .no-selection {
      display: flex;
      flex-direction: column;
      font-size: 1.25rem;
      align-items: center;
      img {
        height: 24.625rem;
        width: 35rem;
      }
    }
  }
`;

const tableStyle = css`
  width: 83.4375rem;
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

type ErrorLogColumnName =
  | 'index'
  | 'error_code'
  | 'equipment_name'
  | 'error_message'
  | 'occurrence_count'
  | 'occurred_date'
  | 'ppid'
  | 'device'
  | 'process'
  | 'glass_id'
  | 'lot_id'
  | 'chuck'
  | 'download';

const errorLogColumnProps: TableColumnPropsType<ErrorLogState, ErrorLogColumnName> = {
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
    fixed: 'left',
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
    fixed: 'left',
  },
  equipment_name: {
    key: 'equipment_name',
    title: <TableColumnTitle>Equipment Name</TableColumnTitle>,
    dataIndex: 'equipment_name',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'equipment_name'),
    },
    // shouldCellUpdate: (cur, prev) => cur.error_code !== prev.error_code,
  },
  error_message: {
    key: 'error_message',
    title: <TableColumnTitle>Error Message</TableColumnTitle>,
    dataIndex: 'error_message',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'error_message'),
    },
    //shouldCellUpdate: (cur, prev) => cur.error_message !== prev.error_message,
  },
  occurrence_count: {
    key: 'occurrence_count',
    title: <TableColumnTitle>Count</TableColumnTitle>,
    dataIndex: 'occurrence_count',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'occurrence_count'),
    },
    //shouldCellUpdate: (cur, prev) => cur.occurrence_count !== prev.occurrence_count,
  },
  occurred_date: {
    key: 'occurred_date',
    title: <TableColumnTitle>Date</TableColumnTitle>,
    dataIndex: 'occurred_date',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'occurred_date'),
    },
    //shouldCellUpdate: (cur, prev) => cur.occurred_date !== prev.occurred_date,
  },
  ppid: {
    key: 'ppid',
    title: <TableColumnTitle>PPID</TableColumnTitle>,
    dataIndex: 'ppid',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'ppid'),
    },
    //shouldCellUpdate: (cur, prev) => cur.ppid !== prev.ppid,
  },
  device: {
    key: 'device',
    title: <TableColumnTitle>Device</TableColumnTitle>,
    dataIndex: 'device',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'device'),
    },
    //shouldCellUpdate: (cur, prev) => cur.device !== prev.device,
  },
  process: {
    key: 'process',
    title: <TableColumnTitle>Process</TableColumnTitle>,
    dataIndex: 'process',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'process'),
    },
    //shouldCellUpdate: (cur, prev) => cur.process !== prev.process,
  },
  glass_id: {
    key: 'glass_id',
    title: <TableColumnTitle>Glass Id</TableColumnTitle>,
    dataIndex: 'glass_id',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'glass_id'),
    },
    //shouldCellUpdate: (cur, prev) => cur.glass_id !== prev.glass_id,
  },
  lot_id: {
    key: 'lot_id',
    title: <TableColumnTitle>Lot Id</TableColumnTitle>,
    dataIndex: 'lot_id',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'lot_id'),
    },
    //shouldCellUpdate: (cur, prev) => cur.lot_id !== prev.lot_id,
  },
  chuck: {
    key: 'chuck',
    title: <TableColumnTitle>Chuck</TableColumnTitle>,
    dataIndex: 'chuck',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'chuck'),
    },
    //shouldCellUpdate: (cur, prev) => cur.chuck !== prev.chuck,
  },
  download: {
    key: 'download',
    title: <TableColumnTitle>Request Download</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    //shouldCellUpdate: (cur, prev) => cur.id !== prev.id,
    fixed: 'right',
  },
};
