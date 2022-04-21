import { css } from '@emotion/react';
import React from 'react';
import CrasData from '../../../components/modules/CrasData';
import CrasDataEdit from '../../../components/modules/CrasData/CrasDataEdit';

export type CrasDataProps = {
  children?: React.ReactNode;
};

function RulesCras({ children }: CrasDataProps): JSX.Element {
  return (
    <div css={style}>
      <CrasData />
    </div>
  );
}

type RulesCrasEditCreateProps = {};

function RulesCrasEditCreate({}: RulesCrasEditCreateProps): JSX.Element {
  return (
    <div css={style}>
      <CrasDataEdit type="create" />
    </div>
  );
}

type RulesCrasEditJudgeProps = {};

function RulesCrasEditJudge({}: RulesCrasEditJudgeProps): JSX.Element {
  return (
    <div css={style}>
      <CrasDataEdit type="judge" />
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

RulesCras.EditCreate = RulesCrasEditCreate;
RulesCras.EditJudge = RulesCrasEditJudge;

export default RulesCras;
