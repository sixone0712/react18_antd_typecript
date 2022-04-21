import { blue } from '@ant-design/colors';
import { CloudServerOutlined, DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Row, Table } from 'antd';
import React, { useCallback } from 'react';
import useSiteDBInfoTable from '../../../hooks/useSiteDBInfoTable';
import { SiteDBInfo } from '../../../lib/api/axios/types';
import { CRAS_LOCALHOST_NAME } from '../../../lib/constants';
import { TableColumnTitle } from '../../../lib/util/commonStyle';
import { compareTableItem } from '../../../lib/util/compareTableItem';
import { TableColumnPropsType } from '../../../types/common';
import { SiteDBInfoColumnName } from '../../../types/configure';
import ConfigTitle from './ConfigTitle';

export type SitesSettingTableProps = {};

export default function SitesSettingTable({}: SitesSettingTableProps): JSX.Element {
  const {
    isFetchingSiteList,
    siteList,
    siteListLen,
    refreshSiteList,
    openAddDrawer,
    openEditModal,
    openDeleteModal,
  } = useSiteDBInfoTable();

  const numberRender = useCallback((value: number, record: SiteDBInfo, index: number) => value + 1, []);

  const crasAddressRender = useCallback(
    (value: string, record: SiteDBInfo, index: number) => (value === CRAS_LOCALHOST_NAME ? 'localhost' : value),
    []
  );

  const handleClickEdit = useCallback(
    (record: SiteDBInfo) => {
      openEditModal(record);
    },
    [openEditModal]
  );

  const editRender = useCallback(
    (value: number, record: SiteDBInfo, index: number) => (
      <EditOutlined css={iconStyle} onClick={() => handleClickEdit(record)} />
    ),
    [handleClickEdit]
  );

  const handleClickAdd = useCallback(() => {
    openAddDrawer();
  }, [openAddDrawer]);

  const deleteRender = useCallback((value: number, record: SiteDBInfo, index: number) => {
    const { siteId, crasCompanyFabName } = record;
    return <DeleteOutlined css={iconStyle} onClick={() => openDeleteModal(siteId, crasCompanyFabName)} />;
  }, []);

  return (
    <>
      <ConfigTitle
        icon={<CloudServerOutlined />}
        title="Cras Server / E-mail Server / Rapid Collector Server Infomation"
        firstBtnProps={{
          name: 'Add',
          action: handleClickAdd,
          icon: <PlusOutlined />,
          disabled: isFetchingSiteList,
        }}
        secondBtnProps={{
          icon: <ReloadOutlined />,
          action: refreshSiteList,
          disabled: isFetchingSiteList,
          loading: isFetchingSiteList,
        }}
      />
      <Container>
        <Table<SiteDBInfo>
          rowKey={'index'}
          dataSource={siteList}
          bordered
          size="small"
          css={tableStyle}
          scroll={{ x: 1304 }}
          sticky={true}
          loading={isFetchingSiteList}
          pagination={{
            position: ['bottomCenter'],
            total: siteListLen,
            showSizeChanger: true,
          }}
        >
          <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.index} width={100} render={numberRender}></Table.Column>
          <Table.ColumnGroup<SiteDBInfo> {...siteDBInfoColumnProps.crasServer}>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.crasCompanyFabName} width={250}></Table.Column>
            <Table.Column<SiteDBInfo>
              {...siteDBInfoColumnProps.crasAddress}
              width={184}
              render={crasAddressRender}
            ></Table.Column>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.crasPort} width={100}></Table.Column>
          </Table.ColumnGroup>
          <Table.ColumnGroup<SiteDBInfo> {...siteDBInfoColumnProps.emailServer}>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.emailAddress} width={184}></Table.Column>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.emailPort} width={100}></Table.Column>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.emailUserName} width={250}></Table.Column>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.emailFrom} width={250}></Table.Column>
          </Table.ColumnGroup>
          <Table.ColumnGroup<SiteDBInfo> {...siteDBInfoColumnProps.rapidCollector}>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.rssAddress} width={184}></Table.Column>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.rssPort} width={100}></Table.Column>
            <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.rssUserName} width={250}></Table.Column>
          </Table.ColumnGroup>
          <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.edit} width={84} render={editRender}></Table.Column>
          <Table.Column<SiteDBInfo> {...siteDBInfoColumnProps.delete} width={84} render={deleteRender}></Table.Column>
        </Table>
      </Container>
    </>
  );
}

const Container = styled(Row)`
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  margin-top: 0.8rem;
`;

const siteDBInfoColumnProps: TableColumnPropsType<SiteDBInfo, SiteDBInfoColumnName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    fixed: 'left',
  },
  crasServer: {
    key: 'none',
    title: <TableColumnTitle>Cras Server</TableColumnTitle>,
  },
  crasCompanyFabName: {
    key: 'crasCompanyFabName',
    title: <TableColumnTitle>User-Fab Name</TableColumnTitle>,
    dataIndex: 'crasCompanyFabName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasCompanyFabName'),
    },
  },
  crasAddress: {
    key: 'crasAddress',
    title: <TableColumnTitle>IP Address</TableColumnTitle>,
    dataIndex: 'crasAddress',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasAddress'),
    },
  },
  crasPort: {
    key: 'crasPort',
    title: <TableColumnTitle>Port</TableColumnTitle>,
    dataIndex: 'crasPort',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'crasPort'),
    },
  },
  emailServer: {
    title: <TableColumnTitle>Email Server</TableColumnTitle>,
  },
  emailAddress: {
    key: 'emailAddress',
    title: <TableColumnTitle>IP Address</TableColumnTitle>,
    dataIndex: 'emailAddress',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'emailAddress'),
    },
  },
  emailPort: {
    key: 'emailPort',
    title: <TableColumnTitle>Port</TableColumnTitle>,
    dataIndex: 'emailPort',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'emailPort'),
    },
  },
  emailUserName: {
    key: 'emailUserName',
    title: <TableColumnTitle>User</TableColumnTitle>,
    dataIndex: 'emailUserName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'emailUserName'),
    },
  },
  emailFrom: {
    key: 'emailFrom',
    title: <TableColumnTitle>{`Sender's E-mail`}</TableColumnTitle>,
    dataIndex: 'emailFrom',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'emailFrom'),
    },
  },
  rapidCollector: {
    title: <TableColumnTitle>Rapid Collector Server</TableColumnTitle>,
  },
  rssAddress: {
    key: 'rssAddress',
    title: <TableColumnTitle>IP Address</TableColumnTitle>,
    dataIndex: 'rssAddress',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'rssAddress'),
    },
  },
  rssPort: {
    key: 'rssPort',
    title: <TableColumnTitle>Port</TableColumnTitle>,
    dataIndex: 'rssPort',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'rssPort'),
    },
  },
  rssUserName: {
    key: 'rssUserName',
    title: <TableColumnTitle>User</TableColumnTitle>,
    dataIndex: 'rssUserName',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'rssUserName'),
    },
  },
  edit: {
    title: <TableColumnTitle>Edit</TableColumnTitle>,
    align: 'center',
    fixed: 'right',
  },
  delete: {
    title: <TableColumnTitle>Delete</TableColumnTitle>,
    align: 'center',
    fixed: 'right',
  },
};

const tableStyle = css`
  width: 83.5rem;
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
