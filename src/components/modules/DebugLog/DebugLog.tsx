import { blue } from '@ant-design/colors';
import { DownloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Input, Modal, Table } from 'antd';
import { CompareFn } from 'antd/lib/table/interface';
import { AlignType, DataIndex } from 'rc-table/lib/interface';
import React, { ChangeEvent, Key, KeyboardEventHandler, useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { getDownloadCrasDebugLog, getSiteDBInfo } from '../../../lib/api/axios/requests';
import { SiteDBInfo } from '../../../lib/api/axios/types';
import { API_URL, CRAS_LOCALHOST_NAME } from '../../../lib/constants';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { downloadFileUrl } from '../../../lib/util/download';
import { openNotification } from '../../../lib/util/notification';
import StatusTableHeader from '../StatusTableHeader';

export type DebugLogProps = {};

export default function DebugLog({}: DebugLogProps): JSX.Element {
  const [path, setPath] = useState<string | undefined>();
  const { data: crasServer, isFetching: isFetchingCrasServer, refetch: refetchCrasServer } = useQuery<SiteDBInfo[]>(
    'get_config_site_db_info',
    getSiteDBInfo,
    {
      refetchOnWindowFocus: false,
      onError: () => {
        openNotification('error', 'Error', 'Failed to response setting database information.');
      },
    }
  );

  const indexRender = useCallback((value: number, record: SiteDBInfo, index: number) => value + 1, []);
  const crasDownloadRender = useCallback((value: number, record: SiteDBInfo, index: number) => {
    return (
      <DownloadOutlined
        css={iconStyle}
        onClick={() => {
          downloadCras(record.siteId, record.crasCompanyFabName, record.crasAddress);
        }}
      />
    );
  }, []);

  const downloadCras = useCallback((siteId: number, siteName: string, address: string) => {
    const confirm = Modal.confirm({
      className: 'download-debug-log',
      title: 'Download Cras Debug Log',
      content: `Are you sure to download cras debug log from ${siteName}?`,
      onOk: async () => {
        diableCancelBtn();
        try {
          let newSiteId = 0;
          if (address !== CRAS_LOCALHOST_NAME) {
            newSiteId = siteId;
          }

          // downloadFileUrl(API_URL.GET_DOWNLOAD_CRAS_DEBUG_LOG(newSiteId));

          const { data, fileName } = await getDownloadCrasDebugLog(newSiteId);
          saveAs(data, fileName);

          openNotification('success', 'Success', `Succeed to download cras debug log from ${siteName}'.`);
        } catch (e) {
          console.error(e);
          // openNotification('error', 'Error', `Failed to download cras debug log from ${siteName}!`);
        }
      },
    });

    const diableCancelBtn = () => {
      confirm.update({
        cancelButtonProps: {
          disabled: true,
        },
      });
    };
  }, []);

  const crasTitleRender = useCallback(
    () => (
      <StatusTableHeader
        title={{
          name: 'Registered Site',
          count: crasServer?.length ?? 0,
        }}
        addBtn={{
          name: 'Download LocalHost',
          onClick: () => {
            downloadCras(0, 'localhost', CRAS_LOCALHOST_NAME);
          },
        }}
        refreshBtn={{
          onClick: refetchCrasServer,
        }}
        disabled={isFetchingCrasServer}
        isLoading={isFetchingCrasServer}
      />
    ),
    [isFetchingCrasServer, refetchCrasServer, crasServer, downloadCras]
  );

  const downloadLog = useCallback(() => {
    const confirm = Modal.confirm({
      className: 'download-debug-log',
      title: 'Download Log Monitor Debug Log',
      content: `Are you sure to download log monitor debug log from ${path as string}?`,
      onOk: async () => {
        diableCancelBtn();
        try {
          downloadFileUrl(API_URL.GET_DOWNLOAD_LOG_MOINITOR_DEBUG_LOG(path as string));

          // const { data, fileName } = await getDownloadLogMonitorDebugLog(path as string);
          // saveAs(data, fileName);

          // openNotification('success', 'Success', `Succeed to download log monitor debug log from ${path}'.`);
        } catch (e) {
          console.error(e);
          // openNotification('error', 'Error', `Failed to download log monitor debug log from ${path}!`);
        }
      },
    });

    const diableCancelBtn = () => {
      confirm.update({
        cancelButtonProps: {
          disabled: true,
        },
      });
    };
  }, [path]);

  const logMonitorDownloadRender = useMemo(() => {
    return (
      <DownloadOutlined
        css={logIconStyle(path)}
        onClick={() => {
          downloadLog();
        }}
      />
    );
  }, [downloadLog, path]);

  const onChangePath = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPath(e.target.value);
  }, []);

  const onKeyDown: KeyboardEventHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (path) {
          downloadLog();
        }
      }
    },
    [downloadLog, path]
  );

  return (
    <div css={style}>
      <div className="log-monitor-log">
        <div className="title">Log Monitor Downlaod</div>
        <Input
          className="log-monitor-log-input"
          value={path}
          suffix={logMonitorDownloadRender}
          placeholder="Input a log monitor's log directory and enter"
          onChange={onChangePath}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="cras-log">
        <div className="title">Cras Debug Log Download</div>
        <Table<SiteDBInfo>
          rowKey={'siteId'}
          dataSource={crasServer ?? []}
          bordered
          title={crasTitleRender}
          size="middle"
          pagination={{
            position: ['bottomCenter'],
            total: crasServer?.length ?? 0,
            showSizeChanger: true,
          }}
          loading={isFetchingCrasServer}
        >
          <Table.Column<SiteDBInfo> {...accountColumnProps.index} render={indexRender} />
          <Table.Column<SiteDBInfo> {...accountColumnProps.crasCompanyFabName} />
          <Table.Column<SiteDBInfo> {...accountColumnProps.crasAddress} />
          <Table.Column<SiteDBInfo> {...accountColumnProps.crasPort} />
          <Table.Column<SiteDBInfo> {...accountColumnProps.download} render={crasDownloadRender} />
        </Table>
      </div>
    </div>
  );
}

const style = css`
  display: flex;
  flex-direction: column;
  align-items: center;

  .log-monitor-log,
  .cras-log {
    width: 80rem;
    margin-top: 2rem;
    .title {
      font-size: 1.5rem;
    }
  }

  .log-monitor-log {
    .log-monitor-log-input {
      width: 30rem;
    }
  }
`;

const ColumnTitle = styled.div`
  font-weight: 700;
`;

const iconStyle = css`
  /* font-size: 1.25rem; */

  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

const logIconStyle = (path: string | undefined) => css`
  /* font-size: 1.25rem; */

  pointer-events: ${!path && 'none'};

  color: ${!path && 'gray'};

  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

export type CrasServerColumnName = 'index' | 'crasCompanyFabName' | 'crasAddress' | 'crasPort' | 'download';

export type CrasServerPropsType = {
  [name in CrasServerColumnName]: {
    key?: Key;
    title?: React.ReactNode;
    dataIndex?: DataIndex;
    align?: AlignType;
    sorter?:
      | boolean
      | CompareFn<SiteDBInfo>
      | {
          compare?: CompareFn<SiteDBInfo>;
          /** Config multiple sorter order priority */
          multiple?: number;
        };
  };
};

const accountColumnProps: CrasServerPropsType = {
  index: {
    key: 'index',
    title: <ColumnTitle>No</ColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
  },
  crasCompanyFabName: {
    key: 'crasCompanyFabName',
    title: <ColumnTitle>User-Fab Name</ColumnTitle>,
    dataIndex: 'crasCompanyFabName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasCompanyFabName'),
    },
  },
  crasAddress: {
    key: 'crasAddress',
    title: <ColumnTitle>Address</ColumnTitle>,
    dataIndex: 'crasAddress',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasAddress'),
    },
  },
  crasPort: {
    key: 'crasPort',
    title: <ColumnTitle>Port</ColumnTitle>,
    dataIndex: 'crasPort',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasPort'),
    },
  },

  download: {
    key: 'download',
    title: <ColumnTitle>Download</ColumnTitle>,
    dataIndex: 'siteId',
    align: 'center',
  },
};
