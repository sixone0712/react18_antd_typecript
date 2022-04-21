import { QuestionCircleOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Space, Tooltip } from 'antd';
import React from 'react';

export const ConvertTableNameTooltip = (
  <div>
    <p>Characters that can be entered: alphabet, number, low line(_).</p>
    <p>Start and end must be entered in alphabet or low line(_).</p>
    <p>Not allow spaces and Must have a value</p>
  </div>
);

export const ConvertTableRowIndexTooltip = (
  <div>
    <p>Must have a number greater than 1.</p>
  </div>
);

export const ConvertTableDataTypeTooltip = (
  <div>
    <p>Must select a value</p>
  </div>
);

export const ConvertTableCoefTooltip = (
  <div>
    <p>{`You can input only when Data Type is 'integer' or 'float'.`}</p>
  </div>
);

export const ConvertTableDefaultValue = (
  <div>
    <p>{`If Default Value is selected as lambda, lambda value cannot contain 「"」`}</p>
  </div>
);

export const ConvertTableTitle = React.memo(function ConvertTableTitleComp({
  title,
  tooltip,
}: {
  title: string;
  tooltip: React.ReactNode;
}) {
  return (
    <Tooltip title={tooltip}>
      <Space>
        <div>{title}</div>
        <QuestionCircleOutlined
          css={css`
            color: rgb(0, 0, 0, 0.45);
          `}
        />
      </Space>
    </Tooltip>
  );
});
