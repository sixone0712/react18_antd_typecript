import { FormInstance } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { QUERY_KEY } from '../../lib/api/query/queryKey';
import {
  remoteJobVisibleReducer,
  selectRemoteJobInfo,
  selectRemoteJobStepRules,
  selectRemoteJobVisible,
} from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { RemoteJobJudgeRule, TransferRemoteJobJudgeRule } from '../../types/Job';
import { FormRemoteJobStepsDrawer } from './useRemoteJobStepsDrawer';

export default function useRemoteJobStepsDrawerRules({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const queryClient = useQueryClient();
  // const totalRules = useTypedSelector(selectRemoteJobStepRules);
  const { siteId } = useTypedSelector(selectRemoteJobInfo);
  const totalRules = queryClient.getQueryData<TransferRemoteJobJudgeRule[]>([
    QUERY_KEY.JOB_REMOTE_JOB_JUDGE_RULE_LIST,
    siteId,
  ]);

  const [curRules, setCurRulesState] = useState<RemoteJobJudgeRule[]>([]);
  const dispatch = useDispatch();
  const isEditModal = useTypedSelector(selectRemoteJobVisible('isJudgeRules'));

  const onOpenEditModal = useCallback(() => {
    dispatch(remoteJobVisibleReducer({ isJudgeRules: true }));
  }, [dispatch]);

  useEffect(() => {
    if (!isEditModal) {
      setCurRulesState(form.getFieldValue('selectJudgeRules') ?? []);
    }
  }, [isEditModal]);

  return {
    totalRules,
    curRules,
    setCurRulesState,
    onOpenEditModal,
  };
}
