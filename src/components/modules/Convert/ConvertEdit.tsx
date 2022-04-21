import { css } from '@emotion/react';
import { Divider, PageHeader } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useConvertEdit from '../../../hooks/useConvertEdit';
import { PAGE_URL } from '../../../lib/constants';
import { convertLogNameSelector } from '../../../reducers/slices/convert';
import SideSteps from '../../atoms/SideSteps';
import StepButton from '../../atoms/StepButton';
import ConvertDefineTable from './ConvertDefineTable';
import ConvertFilter from './ConvertFilter';
import ConvertSelectRule from './ConvertSelectRule';

export type ConvertEditProps = {};

export default function ConvertEdit({}: ConvertEditProps): JSX.Element {
  const { current, setCurrent, nextAction, selectRuleForm, headersColumsForm } = useConvertEdit();
  return (
    <div css={style}>
      <div>
        <ConvertStep current={current} setCurrent={setCurrent} nextAction={nextAction} />
        {current === CONVERT_RULE_STEP.SELECT_RULE && <ConvertSelectRule form={selectRuleForm} />}
        {current === CONVERT_RULE_STEP.HEADERS_COLUMNS && <ConvertDefineTable form={headersColumsForm} />}
        {current === CONVERT_RULE_STEP.DATA_FILTER && <ConvertFilter />}
      </div>
    </div>
  );
}

const style = css``;

export const convertRuletep = ['Select Rule', 'Define Headers & Columns', 'Define Data Filter'];

export enum CONVERT_RULE_STEP {
  SELECT_RULE = 0,
  HEADERS_COLUMNS,
  DATA_FILTER,
}

interface ConvertStopProps {
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  nextAction: () => Promise<boolean>;
}
function ConvertStep({ current, setCurrent, nextAction }: ConvertStopProps) {
  const history = useHistory();
  const logName = useSelector(convertLogNameSelector);
  return (
    <>
      <PageHeader
        onBack={() => {
          history.push(PAGE_URL.RULES_CONVERT_RULES_ROUTE);
        }}
        title={logName ? `Edit Convert Rule (${logName})` : `Edit Convert Rule`}
      />
      <Divider css={dividerStyle('top')} />
      <SideSteps current={current} stepList={convertRuletep} direction="horizontal" />
      <Divider css={dividerStyle('bottom')} />
      <StepButton
        current={current}
        setCurrent={setCurrent}
        lastStep={CONVERT_RULE_STEP.DATA_FILTER}
        nextActionPromise={nextAction}
        type="edit"
        title={convertRuletep[current]}
      />
    </>
  );
}

const dividerStyle = (position: 'top' | 'bottom') => css`
  border: 2px solid #8c8c8c;
  margin-top: ${position === 'top' && 0};
`;
