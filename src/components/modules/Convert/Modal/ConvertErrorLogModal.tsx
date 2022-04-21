import { ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Modal, Space, Table } from 'antd';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { getConvertError } from '../../../../lib/api/axios/requests';
import { QUERY_KEY } from '../../../../lib/api/query/queryKey';
import { TableColumnTitle } from '../../../../lib/util/commonStyle';
import { compareTableItem } from '../../../../lib/util/compareTableItem';
import { openNotification } from '../../../../lib/util/notification';
import {
  convertErrorLogIdSelector,
  convertShowErrorSelector,
  setConvertErrorLogIdReducer,
  setConvertShowErrorReducer,
} from '../../../../reducers/slices/convert';
import useTypedSelector from '../../../../reducers/useTypedSelector';
import { TableColumnPropsType } from '../../../../types/common';
import { ConvertRuleItemErrorMsg } from '../../../../types/convertRules';
import { ellipsisLineStyle } from '../../../atoms/Common/Common';
import TableTitle from '../../../atoms/TableTitle';

export default function ConvertErrorLogModal() {
  const visible = useTypedSelector(convertShowErrorSelector);
  const dispatch = useDispatch();
  const errorLogId = useTypedSelector(convertErrorLogIdSelector);

  const { data, isFetching, refetch } = useQuery<ConvertRuleItemErrorMsg[], AxiosError>(
    [QUERY_KEY.RULES_CONVERT_ERROR, errorLogId],
    () => getConvertError(errorLogId as number),
    {
      enabled: Boolean(errorLogId),
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of cras log error`, error);
      },
    }
  );

  const renderTitle = useCallback(() => {
    return (
      <TableTitle
        title={
          <Space size={2}>
            <Badge color="blue" />
            <div>{`Occurred errors : ${data?.length ?? 0}`}</div>
          </Space>
        }
        btn1={{
          icon: <ReloadOutlined />,
          onClick: refetch,
          loading: isFetching,
        }}
      />
    );
  }, [data, refetch, isFetching]);
  const setClose = useCallback(() => {
    dispatch(setConvertShowErrorReducer(false));
  }, [dispatch]);

  useEffect(() => {
    if (!visible) {
      dispatch(setConvertErrorLogIdReducer(null));
    }
  }, [visible]);

  return (
    <div>
      <Modal
        title={'Error Messages'}
        visible={visible}
        onOk={setClose}
        okText="Close"
        cancelButtonProps={{
          hidden: true,
        }}
        closable
        onCancel={setClose}
        maskClosable
        destroyOnClose
        width={'1208px'}
      >
        <Table<ConvertRuleItemErrorMsg>
          rowKey={'index'}
          dataSource={data ?? []}
          bordered
          title={renderTitle}
          size="small"
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          tableLayout="fixed"
          loading={isFetching}
          //  css={tableStyle}
        >
          <Table.Column<ConvertRuleItemErrorMsg> {...convetErrorColumnProps.index} />
          <Table.Column<ConvertRuleItemErrorMsg> {...convetErrorColumnProps.equipment} />
          <Table.Column<ConvertRuleItemErrorMsg> {...convetErrorColumnProps.file} />
          <Table.Column<ConvertRuleItemErrorMsg> {...convetErrorColumnProps.row} />
          <Table.Column<ConvertRuleItemErrorMsg> {...convetErrorColumnProps.content} />
          <Table.Column<ConvertRuleItemErrorMsg> {...convetErrorColumnProps.msg} />
          <Table.Column<ConvertRuleItemErrorMsg> {...convetErrorColumnProps.created} />
        </Table>
      </Modal>
    </div>
  );
}

export type ConvertErrorColumnName = 'index' | 'equipment' | 'file' | 'row' | 'content' | 'msg' | 'created';

const convetErrorColumnProps: TableColumnPropsType<ConvertRuleItemErrorMsg, ConvertErrorColumnName> = {
  index: {
    key: 'index',
    title: <TableColumnTitle>No</TableColumnTitle>,
    dataIndex: 'index',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'index'),
    },
    width: 70,
    render: function renderIndex(value: number, record: ConvertRuleItemErrorMsg, index: number) {
      return <div>{value + 1}</div>;
    },
  },
  equipment: {
    key: 'equipment',
    title: <TableColumnTitle>Equipment Name</TableColumnTitle>,
    dataIndex: 'equipment',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'equipment'),
    },
    width: 150,
  },
  file: {
    key: 'file',
    title: <TableColumnTitle>File Name</TableColumnTitle>,
    dataIndex: 'file',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'file'),
    },
    width: 150,
  },
  row: {
    key: 'row',
    title: <TableColumnTitle>Log Line</TableColumnTitle>,
    dataIndex: 'row',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'row'),
    },
    width: 70,
  },

  content: {
    key: 'content',
    title: <TableColumnTitle>Log Content</TableColumnTitle>,
    dataIndex: 'content',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'content'),
    },
    width: 300,
    render: function renderContent(value: string, record: ConvertRuleItemErrorMsg, index: number) {
      return (
        <div title={value} css={ellipsisLineStyle({ line: 2 })}>
          {value}
        </div>
      );
    },
  },
  msg: {
    key: 'msg',
    title: <TableColumnTitle>Error Message</TableColumnTitle>,
    dataIndex: 'msg',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'msg'),
    },
    width: 300,
  },
  created: {
    key: 'created',
    title: <TableColumnTitle>Date</TableColumnTitle>,
    dataIndex: 'created',
    align: 'center',
    sorter: {
      compare: (a, b) => compareTableItem(a, b, 'created'),
    },
    width: 120,
  },
};
