import { css } from '@emotion/react';
import { Table } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { convertPreviewConvertSelector } from '../../../reducers/slices/convert';

export type ConvertFilterPreviousProps = {};

function ConvertFilterPrevious({}: ConvertFilterPreviousProps): JSX.Element {
  const previewData = useSelector(convertPreviewConvertSelector);

  if (!previewData.header || previewData.header.length === 0) {
    return <></>;
  }

  return (
    <div css={style}>
      <Table
        rowKey={'index'}
        columns={previewData.header ?? undefined}
        dataSource={previewData.data ?? undefined}
        bordered
        size="small"
        scroll={{ x: true }}
        pagination={false}
      />
    </div>
  );
}

export default React.memo(ConvertFilterPrevious);

const style = css`
  width: 81.5rem;

  & table {
    font-size: 0.75rem;
    &:first-of-type > thead > tr > th {
      background: #f0f5ff;
    }
  }
`;
