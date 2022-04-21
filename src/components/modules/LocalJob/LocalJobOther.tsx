import { MailOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Checkbox, Collapse, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { localJobErrorNoticeReducer, selectLocalJobErrorNoticeIsEmail } from '../../../reducers/slices/localJob';
import useTypedSelector from '../../../reducers/useTypedSelector';
import LocalJobNoticeEmail from './LocalJobOtherNoticeEmail';

export type LocalJobOtherProps = {};

export default function LocalJobOther({}: LocalJobOtherProps): JSX.Element {
  return (
    <div css={style}>
      <ErrorNotice />
    </div>
  );
}

const style = css`
  font-size: 1rem;
  flex-wrap: nowrap;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const ErrorNotice = React.memo(function ErrorNoticeMemo() {
  const dispatch = useDispatch();
  const isNotice = useTypedSelector(selectLocalJobErrorNoticeIsEmail);
  const [active, setActive] = useState(false);

  const setIsNotice = useCallback(
    (e: CheckboxChangeEvent) => {
      setActive(e.target.checked);
      dispatch(
        localJobErrorNoticeReducer({
          isEmail: e.target.checked,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    setActive(isNotice);
  }, []);

  const Header = useMemo(
    () => (
      <div onClick={() => setActive((prev) => !prev)}>
        <Space>
          <MailOutlined />
          <div>Error Notice</div>
        </Space>
      </div>
    ),
    [setActive]
  );
  return (
    <div css={errorNoticeStyle}>
      <div className="excute-checkbox">
        <Checkbox checked={isNotice} onChange={setIsNotice} />
      </div>
      <Collapse
        collapsible={isNotice ? 'header' : 'disabled'}
        activeKey={active ? 'errorNotice' : ''}
        css={collapseStyle(isNotice)}
      >
        <Collapse.Panel header={Header} key={'errorNotice'}>
          <LocalJobNoticeEmail />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
});

const errorNoticeStyle = css`
  display: flex;

  .excute-checkbox {
    display: inherit;
    margin-right: 1rem;
    height: 3rem;
    align-items: center;

    .empty {
      width: 1rem;
      height: 3rem;
    }
  }
  .ant-collapse-item {
    width: 61.375rem;
    .ant-collapse-content-box {
      display: flex;
      flex-direction: column;
    }
  }
`;

export const collapseStyle = (enable: boolean) => css`
  width: 61.5rem;
  cursor: ${!enable && 'not-allowed'};
  .ant-collapse-header {
    pointer-events: ${!enable && 'none'};
  }
`;
