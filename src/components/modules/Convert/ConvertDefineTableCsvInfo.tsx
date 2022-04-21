import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Form, Table } from 'antd';
import React, { useCallback, useMemo, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useConvertCsvInfo from '../../../hooks/useConvertCsvInfo';
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
} from './ConvertDefineTableItem';
import {
  ConvertTableDataTypeTooltip,
  ConvertTableNameTooltip,
  ConvertTableRowIndexTooltip,
  ConvertTableTitle,
} from './ConvertTitleItem';

const type = 'DraggableBodyRow';

export type ConvertDefineTableInfoProps = {};

function ConvertDefineTableCsvInfo({}: ConvertDefineTableInfoProps): JSX.Element {
  const {
    infoTable,
    onChangeRowIndex,
    onChangeName,
    onChangeOutputColumn,
    onChangeOutputColumnSelect,
    columnOptions,
    options,
    onChangeDefaultType,
    onChangeDefaultValue,
    onChangeDataType,
    onDelete,
    onChangeSkip,
    onAdd,
    moveRow,
    fetchingRuleBase,
    isNewRule,
  } = useConvertCsvInfo();

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

  const rowIndexRender = useCallback(
    (value: number, record: RuleData, index: number) => {
      return (
        <ConvertInputNumber
          keyName="row_index"
          record={record}
          onChange={onChangeRowIndex}
          style={{
            width: 70,
            fontSize: '0.75rem',
          }}
          min={1}
        />
      );
    },
    [onChangeRowIndex]
  );

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
          //tooltip="What do you want others to call you?"
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
        scroll={{ x: 'max-content' }}
        css={tableStyle}
        rowKey="index"
        loading={fetchingRuleBase}
      >
        <Table.Column<RuleData> {...infoColumnProps.sort} render={() => <MenuOutlined />} />
        <Table.Column<RuleData> {...infoColumnProps.index} render={indexRender} />
        <Table.Column<RuleData> {...infoColumnProps.row_index} render={rowIndexRender} />
        <Table.Column<RuleData> {...infoColumnProps.data} />
        <Table.Column<RuleData> {...infoColumnProps.name} render={nameRender} />
        <Table.Column<RuleData> {...infoColumnProps.output_column} render={outputColumnRender} />
        <Table.Column<RuleData> {...infoColumnProps.data_type} render={dataTypeRender} />
        <Table.Column<RuleData> {...infoColumnProps.def_val} render={defaultValueRender} />
        <Table.Column<RuleData> {...infoColumnProps.delete} render={deleteRender} />
        <Table.Column<RuleData> {...infoColumnProps.skip} render={skipRender} />
      </Table>
    </DndProvider>
  );
}

export default React.memo(ConvertDefineTableCsvInfo);

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

type InfoColumnName =
  | 'sort'
  | 'index'
  | 'row_index'
  | 'data'
  | 'name'
  | 'output_column'
  | 'data_type'
  | 'def_val'
  | 'delete'
  | 'skip';

const infoColumnProps: TableColumnPropsType<RuleData, InfoColumnName> = {
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

  row_index: {
    key: 'index',
    title: <ConvertTableTitle title="Row" tooltip={ConvertTableRowIndexTooltip} />,
    dataIndex: 'row_index',
    align: 'center',
    shouldCellUpdate: (cur, prev) =>
      cur.row_index !== prev.row_index ||
      cur.data_type !== prev.data_type ||
      cur.index !== prev.index ||
      cur.skip !== prev.skip,
  },
  data: {
    key: 'data',
    title: 'Data',
    dataIndex: 'data',
    align: 'center',
    shouldCellUpdate: (cur, prev) => cur.data !== prev.data || cur.skip !== prev.skip,
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

const tableStyle = css`
  thead {
    cursor: default;
  }

  tr.drop-over-downward td:nth-of-type(n + 5) {
    border-bottom: 2px dashed #1890ff;
  }

  tr.drop-over-upward td:nth-of-type(n + 5) {
    border-top: 2px dashed #1890ff;
  }
`;
/* 
  tbody > tr:nth-of-type(${index + 2}) {
    td:first-of-type {
      border-left: 1px solid red;
      border-right: 1px solid red;
    }
    td {
      border-top: 1px solid red;
      border-bottom: 1px solid red;
    }
  } */
