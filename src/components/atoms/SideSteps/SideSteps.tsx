import { css } from '@emotion/react';
import { Steps } from 'antd';
import React, { useCallback } from 'react';

export type SideStepsProps = {
  current: number;
  stepList: string[];
  direction?: 'horizontal' | 'vertical';
};

function SideSteps({ current, stepList, direction = 'vertical' }: SideStepsProps): JSX.Element {
  const getDescription = useCallback(
    (step: number) => {
      if (current === step) {
        return 'Processing';
      } else if (current < step) {
        return 'Waiting';
      } else if (current > step) {
        return 'Finished';
      }
    },
    [current]
  );

  return (
    <Steps current={current} direction={direction} css={stepStyle(direction)}>
      {stepList && stepList.map((item, idx) => <Steps.Step key={idx} title={item} description={getDescription(idx)} />)}
    </Steps>
  );
}

const verticalStyle = css`
  width: 16.875rem;
  /* height: 28.125rem; */
  height: 40rem;
  flex-wrap: nowrap;
  border-right: 1px solid #d9d9d9;
  /* padding-top: 4.125rem; */
`;

const horizontalStyle = css`
  width: 86rem;
  /* width: 16.875rem;
  height: 28.125rem;
  flex-wrap: nowrap;
  border-right: 1px solid #d9d9d9;
  padding-top: 4.125rem; */
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

const stepStyle = (direction: 'horizontal' | 'vertical') => css`
  ${direction === 'vertical' ? verticalStyle : horizontalStyle}
`;

export default React.memo(SideSteps);

const style = css``;
