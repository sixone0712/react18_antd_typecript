import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Col, Space } from 'antd';
import React, { useCallback, useState } from 'react';
import { RemoteJobType } from '../../../pages/Status/Remote/Remote';
export type StopButtonProps = {
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  lastStep: number;
  nextAction?: () => boolean;
  nextActionPromise?: () => Promise<boolean>;
  type?: RemoteJobType;
  title?: string;
  disabled?: boolean;
};

const Container = styled(Col)`
  /* display: flex;
  justify-content: space-between;
  width: 47.125rem;
  margin-left: 29.375rem;
  margin-right: 1.75rem; */
`;

function StepButton({
  current,
  setCurrent,
  lastStep,
  nextAction,
  nextActionPromise,
  type = 'add',
  title,
  disabled = false,
}: StopButtonProps): JSX.Element {
  const [loading, setLoading] = useState(false);

  const onNext = useCallback(() => {
    if (current <= lastStep && nextAction && nextAction()) {
      if (current !== lastStep) setCurrent((prevState) => prevState + 1);
    }
  }, [current, setCurrent, nextAction, lastStep]);

  const onNextPromise = useCallback(async () => {
    setLoading(true);
    if (current <= lastStep && nextActionPromise && (await nextActionPromise())) {
      if (current !== lastStep) setCurrent((prevState) => prevState + 1);
    }
    setLoading(false);
  }, [current, setCurrent, nextActionPromise, lastStep]);

  const onPrev = useCallback(() => {
    if (current > 0) setCurrent((prevState) => prevState - 1);
  }, [current, setCurrent]);

  return (
    <Container>
      {title ? (
        <div css={titleStepStyle}>
          <div className="prev">
            {current > 0 ? (
              <Button type="primary" css={btnStyle} onClick={onPrev} loading={loading} disabled={loading || disabled}>
                Prev
              </Button>
            ) : (
              <div className="prev-empty"></div>
            )}
          </div>
          <div className="title">{title}</div>
          <div className="next">
            {current < lastStep ? (
              <Button
                type="primary"
                css={btnStyle}
                onClick={nextActionPromise ? onNextPromise : onNext}
                loading={loading}
                disabled={loading || disabled}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                css={btnStyle}
                onClick={nextActionPromise ? onNextPromise : onNext}
                loading={loading}
                disabled={loading || disabled}
              >
                {type === 'add' ? 'Add' : 'Edit'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Space>
          {current > 0 && (
            <Button type="primary" css={btnStyle} disabled={loading || disabled} onClick={onPrev}>
              Prev
            </Button>
          )}
          {current < lastStep && (
            <Button
              type="primary"
              css={btnStyle}
              loading={loading}
              disabled={loading || disabled}
              onClick={nextActionPromise ? onNextPromise : onNext}
            >
              Next
            </Button>
          )}
          {current >= lastStep && (
            <Button
              type="primary"
              css={btnStyle}
              loading={loading}
              disabled={loading || disabled}
              onClick={nextActionPromise ? onNextPromise : onNext}
            >
              {type === 'add' ? 'Add' : 'Edit'}
            </Button>
          )}
        </Space>
      )}
    </Container>
  );
}

export default React.memo(StepButton);

const btnStyle = css`
  border-radius: 0.625rem;
  width: 5rem;
`;

const titleStepStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 1.5rem;
  }
  .prev {
    margin-left: 0.5rem;
    .prev-empty {
      width: 4rem;
      height: 2rem;
      margin-right: 0.5rem;
    }
  }
  .next {
    margin-right: 0.5rem;
  }
`;
