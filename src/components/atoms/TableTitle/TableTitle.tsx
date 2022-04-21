import { css } from '@emotion/react';
import { Button, Space, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { convertRemToPixels } from '../../../lib/util/remToPixcels';

export type TableTitleProps = {
  title?: string | React.ReactNode;
  component?: React.ReactNode;
  btn1?: {
    name?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    toolTip?: string;
  };
  btn2?: {
    name?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    toolTip?: string;
  };
  btn3?: {
    name?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    toolTip?: string;
  };
  btn4?: {
    name?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    toolTip?: string;
  };
  btn5?: {
    name?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
    toolTip?: string;
  };
};
export default React.memo(function TableTitle({
  title,
  component,
  btn1,
  btn2,
  btn3,
  btn4,
  btn5,
}: TableTitleProps): JSX.Element {
  const Btn1Render = useCallback(() => {
    if (btn1?.toolTip) {
      return (
        <Tooltip title={btn1.toolTip} color="blue">
          <Button
            type="primary"
            icon={btn1?.icon ?? undefined}
            css={btnStyle}
            onClick={btn1?.onClick ?? undefined}
            disabled={btn1?.disabled ?? false}
            loading={btn1?.loading ?? false}
          >
            {btn1?.name}
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Button
          type="primary"
          icon={btn1?.icon ?? undefined}
          css={btnStyle}
          onClick={btn1?.onClick ?? undefined}
          disabled={btn1?.disabled ?? false}
          loading={btn1?.loading ?? false}
        >
          {btn1?.name}
        </Button>
      );
    }
    // }, [btn1?.name, btn1?.icon, btn1?.onClick, btn1?.name, btn1?.loading, btn1?.disabled, btn1?.toolTip]);
  }, [btn1]);

  const Btn2Render = useCallback(() => {
    if (btn2?.toolTip) {
      return (
        <Tooltip title={btn2.toolTip} color="blue">
          <Button
            type="primary"
            icon={btn2?.icon ?? undefined}
            css={btnStyle}
            onClick={btn2?.onClick ?? undefined}
            disabled={btn2?.disabled ?? false}
            loading={btn2?.loading ?? false}
          >
            {btn2?.name}
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Button
          type="primary"
          icon={btn2?.icon ?? undefined}
          css={btnStyle}
          onClick={btn2?.onClick ?? undefined}
          disabled={btn2?.disabled ?? false}
          loading={btn2?.loading ?? false}
        >
          {btn2?.name}
        </Button>
      );
    }
    // }, [btn2?.name, btn2?.icon, btn2?.onClick, btn2?.name, btn2?.loading, btn2?.disabled, btn2?.toolTip]);
  }, [btn2]);

  const Btn3Render = useCallback(() => {
    if (btn3?.toolTip) {
      return (
        <Tooltip title={btn3.toolTip} color="blue">
          <Button
            type="primary"
            icon={btn3?.icon ?? undefined}
            css={btnStyle}
            onClick={btn3?.onClick ?? undefined}
            disabled={btn3?.disabled ?? false}
            loading={btn3?.loading ?? false}
          >
            {btn3?.name}
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Button
          type="primary"
          icon={btn3?.icon ?? undefined}
          css={btnStyle}
          onClick={btn3?.onClick ?? undefined}
          disabled={btn3?.disabled ?? false}
          loading={btn3?.loading ?? false}
        >
          {btn3?.name}
        </Button>
      );
    }
  }, [btn3]);

  const Btn4Render = useCallback(() => {
    if (btn4?.toolTip) {
      return (
        <Tooltip title={btn4.toolTip} color="blue">
          <Button
            type="primary"
            icon={btn4?.icon ?? undefined}
            css={btnStyle}
            onClick={btn4?.onClick ?? undefined}
            disabled={btn4?.disabled ?? false}
            loading={btn4?.loading ?? false}
          >
            {btn4?.name}
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Button
          type="primary"
          icon={btn4?.icon ?? undefined}
          css={btnStyle}
          onClick={btn4?.onClick ?? undefined}
          disabled={btn4?.disabled ?? false}
          loading={btn4?.loading ?? false}
        >
          {btn4?.name}
        </Button>
      );
    }
  }, [btn4]);

  const Btn5Render = useCallback(() => {
    if (btn5?.toolTip) {
      return (
        <Tooltip title={btn5.toolTip} color="blue">
          <Button
            type="primary"
            icon={btn5?.icon ?? undefined}
            css={btnStyle}
            onClick={btn5?.onClick ?? undefined}
            disabled={btn5?.disabled ?? false}
            loading={btn5?.loading ?? false}
          >
            {btn5?.name}
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Button
          type="primary"
          icon={btn5?.icon ?? undefined}
          css={btnStyle}
          onClick={btn5?.onClick ?? undefined}
          disabled={btn5?.disabled ?? false}
          loading={btn5?.loading ?? false}
        >
          {btn5?.name}
        </Button>
      );
    }
  }, [btn5]);

  return (
    <div css={style}>
      <div css="title">{title}</div>
      <div css="button-section">
        <Space size={convertRemToPixels(0.5)}>
          {component && component}
          {btn1 && <Btn1Render />}
          {btn2 && <Btn2Render />}
          {btn3 && <Btn3Render />}
          {btn4 && <Btn4Render />}
          {btn5 && <Btn5Render />}
        </Space>
      </div>
    </div>
  );
});

const style = css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 1rem;
  }

  .button-section {
  }
`;

const btnStyle = css`
  border-radius: 0.625rem;
`;
