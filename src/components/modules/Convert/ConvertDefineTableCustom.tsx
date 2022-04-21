import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Form, Table } from 'antd';
import React, { useCallback } from 'react';
import useConvertCustom from '../../../hooks/useConvertCustom';
import { regExpVariable } from '../../../lib/util/validation';
import { TableColumnPropsType } from '../../../types/common';
import { RuleData } from '../../../types/convertRules';
import TableHeader from '../TableHeader';
import {
  ConvertDataType,
  ConvertDefaultValue,
  ConvertDelete,
  ConvertInput,
  ConvertOutputColumnSelect,
} from './ConvertDefineTableItem';
import { ConvertTableDataTypeTooltip, ConvertTableNameTooltip, ConvertTableTitle } from './ConvertTitleItem';

export type ConvertDefineTableCustomProps = {};

function ConvertDefineTableCustom({}: ConvertDefineTableCustomProps): JSX.Element {
  const {
    customTable,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    options,
    columnOptions,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onDelete,
    onChangeSkip,
    onAdd,
    isNewRule,
    fetchingRuleBase,
  } = useConvertCustom();

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
  const indexRender = useCallback((value: number, record: RuleData, index: number) => {
    return <div>{index + 1}</div>;
  }, []);

  const nameRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertInput
        keyName="name"
        record={record}
        onChange={onChangeName}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
        regex={regExpVariable}
      />
    ),
    [onChangeName]
  );

  const outputColumnRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertOutputColumnSelect
        record={record}
        onChange={onChangeOutputColumn}
        onChangeSelect={onChangeOutputColumnSelect}
        options={columnOptions}
        isNew={isNewRule}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onChangeOutputColumn, onChangeOutputColumnSelect, isNewRule, columnOptions]
  );

  const dataTypeRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertDataType
        record={record}
        options={options}
        onChangeDataType={onChangeDataType}
        disabled={!isNewRule && record.output_column_select !== 'custom'}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),
    [options, onChangeDataType, isNewRule]
  );

  const defaultValueRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertDefaultValue
        record={record}
        options={options}
        onChangeDefValue={onChangeDefaultValue}
        onChangeDefType={onChangeDefaultType}
        style={{
          width: 170,
          fontSize: '0.75rem',
        }}
      />
    ),

    [options, onChangeDefaultValue, onChangeDefaultType]
  );

  const deleteRender = useCallback(
    (value: number, record: RuleData, index: number) => {
      return <ConvertDelete record={record} onDelete={onDelete} />;
    },
    [onDelete]
  );

  const skipRender = useCallback(
    (value: boolean, record: RuleData, index: number) => {
      const { index: itemIndex, skip } = record;
      return <Checkbox checked={value} onChange={() => onChangeSkip(itemIndex as number, !skip)} />;
    },
    [onChangeSkip]
  );

  return (
    <div>
      <Form>
        <Form.Item
          label="Custom Columns :"
          // tooltip="What do you want others to call you?"
          css={css`
            margin-top: 1rem;
            margin-bottom: 0;
          `}
        />
      </Form>
      <Table<RuleData>
        dataSource={customTable ?? []}
        size="small"
        bordered
        pagination={false}
        title={titleRender}
        scroll={{ x: true }}
        rowKey="index"
        loading={fetchingRuleBase}
      >
        <Table.Column<RuleData> {...infoColumnProps.index} render={indexRender} />
        <Table.Column<RuleData> {...infoColumnProps.name} render={nameRender} />
        <Table.Column<RuleData> {...infoColumnProps.output_column} render={outputColumnRender} />
        <Table.Column<RuleData> {...infoColumnProps.data_type} render={dataTypeRender} />
        <Table.Column<RuleData> {...infoColumnProps.def_val} render={defaultValueRender} />
        <Table.Column<RuleData> {...infoColumnProps.delete} render={deleteRender} />
        <Table.Column<RuleData> {...infoColumnProps.skip} render={skipRender} />
      </Table>
    </div>
  );
}

export default React.memo(ConvertDefineTableCustom);

type InfoColumnName = 'index' | 'name' | 'output_column' | 'data_type' | 'def_val' | 'delete' | 'skip';

const infoColumnProps: TableColumnPropsType<RuleData, InfoColumnName> = {
  index: {
    key: 'index',
    title: 'Index',
    dataIndex: 'index',
    align: 'center',
    fixed: 'left',
  },
  name: {
    key: 'name',
    title: <ConvertTableTitle title={'Name'} tooltip={ConvertTableNameTooltip} />,
    dataIndex: 'name',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.name !== prev.name || cur.index !== prev.index || cur.skip !== prev.skip,
  },
  output_column: {
    key: 'output_column',
    title: 'Output Column',
    dataIndex: 'output_column',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.output_column !== prev.output_column ||
      cur.output_column_select !== prev.output_column_select ||
      cur.index !== prev.index ||
      cur.skip !== prev.skip,
  },
  data_type: {
    key: 'data_type',
    title: <ConvertTableTitle title="Data Type" tooltip={ConvertTableDataTypeTooltip} />,
    dataIndex: 'data_type',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.data_type !== prev.data_type ||
      cur.output_column_select !== prev.output_column_select ||
      cur.index !== prev.index ||
      cur.skip !== prev.skip,
  },
  def_val: {
    key: 'def_val',
    title: 'Default Value',
    dataIndex: 'def_val',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.def_val !== prev.def_val ||
      cur.def_type !== prev.def_type ||
      cur.index !== prev.index ||
      cur.skip !== prev.skip,
  },
  delete: {
    key: 'delete',
    title: 'Delete',
    dataIndex: 'index',
    align: 'center',
    fixed: 'right',
  },
  skip: {
    key: 'skip',
    title: 'Skip',
    dataIndex: 'skip',
    align: 'center',
    fixed: 'right',
  },
};
