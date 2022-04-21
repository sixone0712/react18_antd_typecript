import { blue } from '@ant-design/colors';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Popconfirm, Table } from 'antd';
import React, { useCallback } from 'react';
import useConvertFilterSetting from '../../../hooks/useConvertFilterSetting';
import { regExpVariable } from '../../../lib/util/validation';
import { TableColumnPropsType } from '../../../types/common';
import { RuleFilterData } from '../../../types/convertRules';
import TableHeader from '../TableHeader';
import { ConvertFilterCondition, ConvertFilterName, ConvertFilterType } from './ConvertFilterItem';
import { ConvertTableNameTooltip, ConvertTableTitle } from './ConvertTitleItem';

export type ConvertFilterSettingProps = {};

function ConvertFilterSetting({}: ConvertFilterSettingProps): JSX.Element {
  const {
    filterTable,
    onChangeName,
    onChangeType,
    onChangeCondition,
    options,
    onDelete,
    onAdd,
  } = useConvertFilterSetting();

  const titleRender = useCallback(
    () => (
      <TableHeader
        title=""
        button1={{
          name: 'Add',
          icon: <PlusOutlined />,
          onClick: onAdd,
        }}
      />
    ),
    [onAdd]
  );
  const indexRender = useCallback((value: number, record: RuleFilterData, index: number) => {
    return <div>{index + 1}</div>;
  }, []);

  const nameRender = useCallback(
    (value: string | null, record: RuleFilterData, index: number) => (
      <ConvertFilterName
        record={record}
        onChange={onChangeName}
        style={{
          width: 250,
          fontSize: '0.75rem',
        }}
        regex={regExpVariable}
      />
    ),
    [onChangeName]
  );

  const typeRender = useCallback(
    (value: string | null, record: RuleFilterData, index: number) => (
      <ConvertFilterType
        record={record}
        options={options}
        onChangeDataType={onChangeType}
        style={{
          width: 200,
          fontSize: '0.75rem',
        }}
      />
    ),
    [options, onChangeType]
  );

  const conditionRender = useCallback(
    (value: string | null, record: RuleFilterData, index: number) => (
      <ConvertFilterCondition
        record={record}
        onChange={onChangeCondition}
        style={{
          width: 500,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onChangeCondition]
  );

  const deleteRender = useCallback(
    (value: number, record: RuleFilterData, index: number) => {
      return (
        <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete(value)}>
          <DeleteOutlined css={iconStyle} />
        </Popconfirm>
      );
    },
    [onDelete]
  );

  return (
    <div css={style}>
      <Table<RuleFilterData>
        dataSource={filterTable ?? []}
        size="small"
        bordered
        pagination={false}
        title={titleRender}
        scroll={{ x: true }}
        rowKey="index"
      >
        <Table.Column<RuleFilterData> {...filterColumnProps.index} render={indexRender} width={80} />
        <Table.Column<RuleFilterData> {...filterColumnProps.name} render={nameRender} />
        <Table.Column<RuleFilterData> {...filterColumnProps.type} render={typeRender} />
        <Table.Column<RuleFilterData> {...filterColumnProps.condition} render={conditionRender} />
        <Table.Column<RuleFilterData> {...filterColumnProps.delete} render={deleteRender} width={80} />
      </Table>
    </div>
  );
}

export default React.memo(ConvertFilterSetting);

type FilterColumnName = 'index' | 'name' | 'type' | 'condition' | 'delete';

const filterColumnProps: TableColumnPropsType<RuleFilterData, FilterColumnName> = {
  index: {
    key: 'index',
    title: 'Index',
    dataIndex: 'index',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },
  name: {
    key: 'name',
    title: <ConvertTableTitle title={'Name'} tooltip={ConvertTableNameTooltip} />,
    dataIndex: 'name',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.name !== prev.name || cur.index !== prev.index,
  },
  type: {
    key: 'type',
    title: 'Type',
    dataIndex: 'type',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.type !== prev.type || cur.index !== prev.index,
  },
  condition: {
    key: 'condition',
    title: 'condition',
    dataIndex: 'condition',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.condition !== prev.condition || cur.index !== prev.index,
  },
  delete: {
    key: 'delete',
    title: 'Delete',
    dataIndex: 'index',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.index !== prev.index,
  },
};

const style = css`
  & table {
    font-size: 0.75rem;
    &:first-of-type > thead > tr > th {
      background: #f0f5ff;
    }
  }
`;

const iconStyle = css`
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;
