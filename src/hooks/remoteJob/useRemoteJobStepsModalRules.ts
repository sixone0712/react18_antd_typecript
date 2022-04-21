import { FormInstance } from 'antd';
import { TransferDirection } from 'antd/lib/transfer';
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
import { TransferRemoteJobJudgeRule } from '../../types/Job';
import { FormRemoteJobStepsDrawer } from './useRemoteJobStepsDrawer';

export default function useRemoteJobStepsModalRules({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const [targetKeys, setTargetKeys] = useState<string[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const visible = useTypedSelector(selectRemoteJobVisible('isJudgeRules'));
  const dispatch = useDispatch();
  //const data = useTypedSelector(selectRemoteJobStepRules);
  const queryClient = useQueryClient();
  const { siteId } = useTypedSelector(selectRemoteJobInfo);
  const data = queryClient.getQueryData<TransferRemoteJobJudgeRule[]>([
    QUERY_KEY.JOB_REMOTE_JOB_JUDGE_RULE_LIST,
    siteId,
  ]);

  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(remoteJobVisibleReducer({ isJudgeRules: visible }));
    },
    [dispatch]
  );

  const handleOk = useCallback(() => {
    const selectList: TransferRemoteJobJudgeRule[] = [];
    targetKeys?.map((item) => {
      const foundItem = data?.find((innerItem) => innerItem.key === item) ?? undefined;
      if (foundItem) {
        selectList.push(foundItem);
      }
    });

    form.setFieldsValue({
      selectJudgeRules: selectList,
    });
    setVisible(false);
  }, [setVisible, data, targetKeys, form]);

  const handleCancel = useCallback(() => {
    setTargetKeys(targetKeys);
    setVisible(false);
  }, [setVisible, targetKeys]);

  const handleChange = useCallback((targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
  }, []);

  const handleSelectChange = useCallback((sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }, []);

  useEffect(() => {
    if (visible) {
      const selectJudgeRules = (form.getFieldValue('selectJudgeRules') as TransferRemoteJobJudgeRule[]) ?? [];
      const selectedKey = selectJudgeRules.map((item) => item.key) ?? [];
      setTargetKeys([...selectedKey]);
    } else {
      setTargetKeys([]);
      setSelectedKeys([]);
    }
  }, [visible]);

  return {
    visible,
    data,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  };
}
