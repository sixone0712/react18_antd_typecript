import { ReadFilled } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, FormInstance, Table } from 'antd';
import React, { useMemo } from 'react';
import { FormConvertSelectRule } from '../../../hooks/useConvertEdit';
import useConvertPreview from '../../../hooks/useConvertPreview';
import { CrasError } from '../../../types/convertRules';

export type ConvertPreviewProps = {
  type: 'sample' | 'convert' | 'filter';
  selectRuleForm?: FormInstance<FormConvertSelectRule>;
};

function ConvertPreview({ type, selectRuleForm }: ConvertPreviewProps): JSX.Element {
  const { ruleType, isFetching, requestPreview, previewData, isfile } = useConvertPreview({ type, selectRuleForm });

  const renderPreview = useMemo(() => {
    if (type === 'sample' && ruleType === 'regex') {
      if (previewData?.text) {
        return <pre className="text">{previewData?.text}</pre>;
      }
    } else {
      if (previewData?.header && previewData.header.length > 0) {
        return (
          <Table
            rowKey={'index'}
            columns={isFetching ? [] : previewData.header ?? undefined}
            dataSource={isFetching ? [] : previewData.data ?? undefined}
            bordered
            size="small"
            scroll={{ x: true }}
            pagination={false}
            loading={isFetching}
          />
        );
      }
    }
    return <div className="empty"></div>;
  }, [previewData, type, ruleType, isFetching]);

  return (
    <div css={style}>
      <div className="title">
        <div className="title-name">Preview</div>
        <Button
          icon={<ReadFilled />}
          type="primary"
          onClick={requestPreview}
          disabled={isFetching || !isfile}
          loading={isFetching}
        >
          Preview
        </Button>
      </div>
      <div className="context">{renderPreview}</div>
    </div>
  );
}

export default React.memo(ConvertPreview);

const style = css`
  padding: 0.5rem 0.5rem 0 0.5rem;
  width: 84.75rem;
  display: flex;
  flex-direction: column;
  .title {
    border-top: 1px solid #d9d9d9;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-radius: 0.5rem 0.5rem 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title-name {
      margin-left: 0.5rem;
      font-size: 1.2rem;
    }
    .ant-btn {
      margin-right: 0.5rem;
      border-radius: 0.5rem;
    }
    padding: 0.5rem 0 0.5rem 0;
  }
  .context {
    padding: 0.5rem;
    border: 1px solid #d9d9d9;
    border-radius: 0 0 0.5rem 0.5rem;
    .empty {
      min-height: 10rem;
    }
    & table {
      font-size: 0.75rem;
      &:first-of-type > thead > tr > th {
        background: #f0f5ff;
        font-size: 0.875rem;
      }
    }
    .text {
      margin-left: 1rem;
      margin-right: 1rem;
      max-height: 20rem;
    }
  }
`;

export const CrasErrorDescription = ({ msg, cras_error }: { msg: string; cras_error?: CrasError }) => {
  return (
    <div>
      <div>{msg}</div>
      <div>{cras_error?.error ? `cras error : ${cras_error.error}` : undefined}</div>
      {cras_error?.error_list?.map((item, idx) => (
        <div key={item.key}>
          <div>{`[error #${idx + 1}]`}</div>
          <div>{`key : ${item.key ?? ''}`}</div>
          <div>{`name : ${item.name ?? ''}`}</div>
          <div>{`reason : ${item.reason ?? ''}`}</div>
        </div>
      ))}
    </div>
  );
};
