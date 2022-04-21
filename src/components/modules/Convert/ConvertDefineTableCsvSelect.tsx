import { Checkbox, Table } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React from 'react';
import useConvertCsvSelect from '../../../hooks/useConvertCsvSelect';

export type ConvertDefineTableSelectProps = {};

function ConvertDefineTableCsvSelect({}: ConvertDefineTableSelectProps): JSX.Element {
  const { previewSample, selectInfo, selectHeader, onChangeSelectInfo, onChangeSelectHeader } = useConvertCsvSelect();

  if (!(previewSample.header && previewSample.header.length > 0)) {
    return <></>;
  }

  return (
    <>
      <Table
        rowKey={'index'}
        dataSource={previewSample.data ?? []}
        bordered
        size="small"
        scroll={{ x: true }}
        pagination={false}
      >
        <Table.Column
          key="info"
          title="Info"
          render={(data, recored, index) => (
            <Checkbox
              checked={index === selectInfo}
              onChange={(e: CheckboxChangeEvent) => onChangeSelectInfo(index, e.target.checked)}
            />
          )}
        />
        <Table.Column
          key="headers"
          title="Headers"
          render={(data, recored, index) => (
            <Checkbox
              checked={index === selectHeader}
              onChange={(e: CheckboxChangeEvent) => onChangeSelectHeader(index, e.target.checked)}
            />
          )}
        />
        {previewSample.header.map((item) => (
          <Table.Column key={item.key} dataIndex={item.dataIndex} title={item.title} />
        ))}
      </Table>
    </>
  );
}

export default React.memo(ConvertDefineTableCsvSelect);
