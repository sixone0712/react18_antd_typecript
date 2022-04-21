import { css } from '@emotion/react';
import { Collapse } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import React from 'react';
import { useSelector } from 'react-redux';
import { FormConvertHeadersColumns } from '../../../hooks/useConvertEdit';
import { convertRuleTypeSelector } from '../../../reducers/slices/convert';
import ConvertDefineTableCsvHeader from './ConvertDefineTableCsvHeader';
import ConvertDefineTableCsvInfo from './ConvertDefineTableCsvInfo';
import ConvertDefineTableCsvSelect from './ConvertDefineTableCsvSelect';
import ConvertDefineTableCustom from './ConvertDefineTableCustom';
import ConvertDefineTableLog from './ConvertDefineTableLog';
import ConvertDefineTableRegexColumn from './ConvertDefineTableRegexColumn';
import ConvertDefineTableRegexSample from './ConvertDefineTableRegexSample';
import ConvertPreview from './ConvertPreview';
export type ConvertDefineTableProps = {
  form: FormInstance<FormConvertHeadersColumns>;
};

export default function ConvertDefineTable({ form }: ConvertDefineTableProps): JSX.Element {
  const ruleType = useSelector(convertRuleTypeSelector);

  if (ruleType === 'csv') {
    return <ConvertCsvHeadersColumns form={form} />;
  } else if (ruleType === 'regex') {
    return <ConvertRegexHeadersColumns form={form} />;
  } else {
    return <></>;
  }
}

const style = css``;

export type ConvertCsvHeadersColumnsProps = {
  form: FormInstance<FormConvertHeadersColumns>;
};
function ConvertCsvHeadersColumns({ form }: ConvertCsvHeadersColumnsProps): JSX.Element {
  return (
    <div css={csvStyle}>
      <div className="input-section">
        <Collapse defaultActiveKey={['rule', 'select', 'define']}>
          <Collapse.Panel header="Rule Define" key="rule">
            <ConvertDefineTableLog form={form} />
          </Collapse.Panel>
          <Collapse.Panel header="Select Headers and Columns" key="select">
            <div className="select-table">
              <ConvertDefineTableCsvSelect />
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="Headers/Coulmns Define" key="define">
            <div className="define-table">
              <ConvertDefineTableCsvInfo />
              <ConvertDefineTableCsvHeader />
              <ConvertDefineTableCustom />
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
      <div className="preview-section">
        <ConvertPreview type="convert" />
      </div>
    </div>
  );
}

const csvStyle = css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  width: 85.75rem;

  .input-section {
    padding: 0.5rem;
  }

  .select-table,
  .define-table {
    width: 81.5rem;
    & table {
      font-size: 0.75rem;
      &:first-of-type > thead > tr > th {
        background: #f0f5ff;
        font-size: 0.75rem;
      }
    }
  }
`;

export type ConvertRegexHeadersColumnsProps = {
  form: FormInstance<FormConvertHeadersColumns>;
};
function ConvertRegexHeadersColumns({ form }: ConvertRegexHeadersColumnsProps): JSX.Element {
  return (
    <div css={regexStyle}>
      <div className="input-section">
        <Collapse defaultActiveKey={['log', 'sample', 'define']}>
          <Collapse.Panel header="Log Define" key="log">
            <ConvertDefineTableLog form={form} />
          </Collapse.Panel>
          <Collapse.Panel header="Sample Log" key="sample">
            <ConvertDefineTableRegexSample />
          </Collapse.Panel>
          <Collapse.Panel header="Headers/Coulmns Define" key="define">
            <div className="define-table">
              <ConvertDefineTableRegexColumn />
              <ConvertDefineTableCustom />
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
      <div className="preview-section">
        <ConvertPreview type="convert" />
      </div>
    </div>
  );
}

const regexStyle = css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  width: 85.75rem;

  .input-section {
    padding: 0.5rem;
  }

  .define-table {
    width: 81.5rem;
    & table {
      font-size: 0.75rem;
      &:first-of-type > thead > tr > th {
        background: #f0f5ff;
        font-size: 0.75rem;
      }
    }
  }
`;
