import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Form, Table } from 'antd';
import React, { useCallback, useMemo, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useConvertRegexColumn from '../../../hooks/useConvertRegexColumn';
import { regExpVariable } from '../../../lib/util/validation';
import { TableColumnPropsType } from '../../../types/common';
import { RuleData } from '../../../types/convertRules';
import TableHeader from '../TableHeader';
import {
  ConvertDataType,
  ConvertDefaultValue,
  ConvertDelete,
  ConvertInput,
  ConvertInputNumber,
  ConvertOutputColumnSelect,
  ConvertRegex,
} from './ConvertDefineTableItem';
import {
  ConvertTableCoefTooltip,
  ConvertTableDataTypeTooltip,
  ConvertTableNameTooltip,
  ConvertTableTitle,
} from './ConvertTitleItem';
import ConvertDefineRegexModal from './Modal/ConvertDefineRegexModal';

const type = 'DraggableBodyRow';

export type ConvertDefineTableRegexColumnProps = {};

function ConvertDefineTableRegexColumn({}: ConvertDefineTableRegexColumnProps): JSX.Element {
  const {
    infoTable,
    isNewRule,
    options,
    columnOptions,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    onChangePrefix,
    onClickRegex,
    onChangeGroup,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onChangeCoef,
    onChangeUnit,
    onDelete,
    onChangeSkip,
    onAdd,
    moveRow,
  } = useConvertRegexColumn();

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
        keyName={'name'}
        record={record}
        onChange={onChangeName}
        style={{
          width: 150,
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
          width: 150,
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
          width: 150,
          fontSize: '0.75rem',
        }}
      />
    ),

    [options, onChangeDefaultValue, onChangeDefaultType]
  );

  const prefixRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertInput
        keyName={'prefix'}
        record={record}
        onChange={onChangePrefix}
        style={{
          width: 150,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onChangePrefix]
  );

  const regexRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertRegex
        record={record}
        onClick={onClickRegex}
        styleProps={{
          width: 150,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onClickRegex]
  );

  const groupRender = useCallback(
    (value: number, record: RuleData, index: number) => {
      return (
        <ConvertInputNumber
          keyName="re_group"
          record={record}
          onChange={onChangeGroup}
          style={{
            width: 150,
            fontSize: '0.75rem',
          }}
        />
      );
    },
    [onChangeGroup]
  );

  const coefRender = useCallback(
    (value: number, record: RuleData, index: number) => {
      return (
        <ConvertInputNumber
          keyName="coef"
          record={record}
          onChange={onChangeCoef}
          style={{
            width: 150,
            fontSize: '0.75rem',
          }}
        />
      );
    },
    [onChangeCoef]
  );

  const unitRender = useCallback(
    (value: string | null, record: RuleData, index: number) => (
      <ConvertInput
        keyName="unit"
        record={record}
        onChange={onChangeUnit}
        style={{
          width: 150,
          fontSize: '0.75rem',
        }}
      />
    ),
    [onChangeUnit]
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

  const components = useMemo(
    () => ({
      body: {
        row: DraggableBodyRow,
      },
    }),
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Form>
        <Form.Item
          label="Info : "
          required
          tooltip="At least one row must be registered."
          css={css`
            margin-bottom: 0;
          `}
        />
      </Form>
      <Table<RuleData>
        dataSource={infoTable}
        size="small"
        bordered
        tableLayout="fixed"
        pagination={false}
        title={titleRender}
        components={components}
        onRow={(record, index): any => ({
          index,
          moveRow,
        })}
        scroll={{ x: true }}
        css={tableStyle}
        rowKey="index"
      >
        <Table.Column<RuleData> {...regexColumnProps.sort} render={() => <MenuOutlined />} />
        <Table.Column<RuleData> {...regexColumnProps.index} render={indexRender} />
        <Table.Column<RuleData> {...regexColumnProps.name} render={nameRender} />
        <Table.Column<RuleData> {...regexColumnProps.output_column} render={outputColumnRender} />
        <Table.Column<RuleData> {...regexColumnProps.data_type} render={dataTypeRender} />
        <Table.Column<RuleData> {...regexColumnProps.prefix} render={prefixRender} />
        <Table.Column<RuleData> {...regexColumnProps.regex} render={regexRender} />
        <Table.Column<RuleData> {...regexColumnProps.re_group} render={groupRender} />
        <Table.Column<RuleData> {...regexColumnProps.def_val} render={defaultValueRender} />
        <Table.Column<RuleData> {...regexColumnProps.coef} render={coefRender} />
        <Table.Column<RuleData> {...regexColumnProps.unit} render={unitRender} />
        <Table.Column<RuleData> {...regexColumnProps.delete} render={deleteRender} />
        <Table.Column<RuleData> {...regexColumnProps.skip} render={skipRender} />
      </Table>
      <ConvertDefineRegexModal />
    </DndProvider>
  );
}

export default React.memo(ConvertDefineTableRegexColumn);

const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }: any) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem<any>() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

type RegexColumnName =
  | 'sort'
  | 'index'
  | 'name'
  | 'output_column'
  | 'data_type'
  | 'prefix'
  | 'regex'
  | 're_group'
  | 'def_val'
  | 'coef'
  | 'unit'
  | 'delete'
  | 'skip';

const regexColumnProps: TableColumnPropsType<RuleData, RegexColumnName> = {
  sort: {
    key: 'sort',
    title: 'Sort',
    dataIndex: 'index',
    align: 'center',
    fixed: 'left',
  },
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
  prefix: {
    key: 'prefix',
    title: 'Prefix',
    dataIndex: 'prefix',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.prefix !== prev.prefix || cur.index !== prev.index || cur.skip !== prev.skip,
  },
  regex: {
    key: 'regex',
    title: 'Regex',
    dataIndex: 'regex',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.regex !== prev.regex || cur.index !== prev.index || cur.skip !== prev.skip,
  },
  re_group: {
    key: 're_group',
    title: 'Group',
    dataIndex: 're_group',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.re_group !== prev.re_group ||
      cur.data_type !== prev.data_type ||
      cur.index !== prev.index ||
      cur.skip !== prev.skip,
  },
  coef: {
    key: 'coef',
    title: <ConvertTableTitle title="Coefficient" tooltip={ConvertTableCoefTooltip} />,
    dataIndex: 'coef',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.coef !== prev.coef || cur.data_type !== prev.data_type || cur.index !== prev.index || cur.skip !== prev.skip,
  },
  unit: {
    key: 'unit',
    title: 'Unit',
    dataIndex: 'unit',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.unit !== prev.unit || cur.index !== prev.index || cur.skip !== prev.skip,
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

const tableStyle = css`
  tr.drop-over-downward td {
    border-bottom: 2px dashed #1890ff;
  }

  tr.drop-over-upward td {
    border-top: 2px dashed #1890ff;
  }
`;
