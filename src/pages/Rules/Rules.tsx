import { css } from '@emotion/react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PAGE_URL } from '../../lib/constants';
import ConvertRules from './ConvertRules';
import RulesCras from './RulesCras';

export type RulesProps = {};

export default function Rules({}: RulesProps) {
  return (
    <Switch>
      <Route path={PAGE_URL.RULES_CONVERT_RULES_ROUTE} exact component={ConvertRules} />
      <Route path={PAGE_URL.RULES_CONVERT_RULES_EDIT_ROUTE} exact component={ConvertRules.Edit} />
      <Route path={PAGE_URL.RULES_CRAS_DATA_ROUTE} exact component={RulesCras} />
      <Route path={PAGE_URL.RULES_CRAS_DATA_EDIT_CREATE_ROUTE} exact component={RulesCras.EditCreate} />
      <Route path={PAGE_URL.RULES_CRAS_DATA_EDIT_JUDGE_ROUTE} exact component={RulesCras.EditJudge} />
    </Switch>
  );
}

const style = css``;
