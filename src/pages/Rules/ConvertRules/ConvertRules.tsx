import { css } from '@emotion/react';
import React from 'react';
import Convert from '../../../components/modules/Convert';
import ConvertEdit from '../../../components/modules/Convert/ConvertEdit';

export type ConvertRulesProps = {
  children?: React.ReactNode;
};

function ConvertRules({ children }: ConvertRulesProps): JSX.Element {
  return (
    <div css={style}>
      <Convert />
    </div>
  );
}

type ConvertRulesEditProps = {};

function ConvertRulesEdit({}: ConvertRulesEditProps): JSX.Element {
  return (
    <div css={style}>
      <ConvertEdit />
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

ConvertRules.Edit = ConvertRulesEdit;

export default ConvertRules;
