import { MailOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import React from 'react';
import { AddressOption } from '../../../types/address';
import PopupTip from '../PopupTip';

export interface EmailSettingViewProps {
  title: string;
  recipients: AddressOption[];
  before: number;
}

export default function EmailSettingView({ title, recipients, before }: EmailSettingViewProps): JSX.Element {
  return (
    <div css={[style, marginTopStyle]}>
      <div className="title">
        <div className="image">
          <MailOutlined />
        </div>
        <div className="text">{title}</div>
      </div>
      <div className="value">
        <PopupTip
          value={`${recipients.length} Recipients`}
          list={recipients.map((item) => item.label as string)}
          placement="right"
          color="blue"
        />

        <div>{`Before ${before} day`}</div>
      </div>
    </div>
  );
}

const marginTopStyle = css`
  margin-top: 1rem;
`;

const style = css`
  display: flex;
  flex-direction: row;
  .title {
    display: flex;
    align-items: flex-start;
    .text {
      margin-left: 0.5rem;
    }
    width: 10.625rem;
  }

  .value {
    margin-left: 2rem;
    width: 37.5rem;
  }
`;
