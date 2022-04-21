import { css } from '@emotion/react';
import { Collapse } from 'antd';
import React from 'react';
import ConvertFilterPrevious from './ConvertFilterPrevious';
import ConvertFilterSetting from './ConvertFilterSetting';
import ConvertPreview from './ConvertPreview';
export type ConvertFilterProps = {};

export default function ConvertFilter({}: ConvertFilterProps): JSX.Element {
  return (
    <div css={style}>
      <div className="filter-section">
        <Collapse defaultActiveKey={['previous', 'select']}>
          <Collapse.Panel header="Previous Preview Table" key="previous">
            <ConvertFilterPrevious />
          </Collapse.Panel>
          <Collapse.Panel header="Filter Setting" key="select">
            <ConvertFilterSetting />
          </Collapse.Panel>
        </Collapse>
      </div>
      <div className="preview-section">
        <ConvertPreview type="filter" />
      </div>
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  width: 85.75rem;
  .filter-section {
    padding: 0.5rem;
  }
`;
