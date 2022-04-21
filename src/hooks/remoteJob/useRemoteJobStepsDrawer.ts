import { FormInstance } from 'antd/lib/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  remoteJobStepsInfoReducer,
  remoteJobVisibleReducer,
  selectRemoteJobVisible,
} from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { AddressOption } from '../../types/address';
import {
  JobCycleType,
  JobModeType,
  JobScriptType,
  JobStepType,
  RemoteJobStepDetailState,
  RemoteJobStepItemVisible,
  RemoteJobType,
  TransferRemoteJobJudgeRule,
} from '../../types/Job';

export interface FormRemoteJobStepsDrawer {
  type: RemoteJobType;
  uuid: string | null;
  stepId: number | null;
  stepName: string | null;
  stepType: JobStepType;
  enable: boolean;
  mode: JobModeType | null;
  time: string[];
  cycle: JobCycleType | null;
  period: number | null;
  preStep: string | null;
  nextStep: string | null;
  isEmail: boolean;
  recipient: AddressOption[];
  subject: string | null;
  body: string | null;
  selectJudgeRules: TransferRemoteJobJudgeRule[];
  before: number | null;
  description: string | null;
  scriptType: JobScriptType | null;
  script: string | null;
  fileIndices: number[];
}

export default function useRemoteJobStepsDrawer({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const dispatch = useDispatch();
  const visible = useTypedSelector(selectRemoteJobVisible('isStep'));
  const [itemVisible, setItemVisible] = useState<RemoteJobStepItemVisible>({
    isEmail: false,
    isExcuteMode: false,
    isScript: false,
    isBefore: false,
    isJudgeRules: false,
  });
  const [type, setType] = useState<RemoteJobType>('add');

  const onCloseDrawer = useCallback(() => {
    dispatch(
      remoteJobVisibleReducer({
        isStep: false,
      })
    );
  }, [dispatch]);

  const onSubmit = useCallback(async () => {
    try {
      const data = await form.validateFields();
      console.log('data', data, stepFormToReduxState(data));
      dispatch(remoteJobStepsInfoReducer(stepFormToReduxState(data)));
      dispatch(
        remoteJobVisibleReducer({
          isStep: false,
        })
      );
    } catch (e) {
      console.error('Validate Failed: ', e);
    }
  }, [form, dispatch]);

  useEffect(() => {
    if (visible) {
      setType(form.getFieldValue('index') ? 'edit' : 'add');
      const stepType = form.getFieldValue('stepType') as JobStepType;
      setItemVisible({
        isEmail:
          stepType === 'collect' || stepType === 'convert' || stepType === 'purge' || stepType === 'custom'
            ? false
            : true,
        isExcuteMode: stepType === 'notice' ? false : true,
        isScript: stepType === 'custom' ? true : false,
        isBefore: stepType === 'summary' || stepType === 'cras' || stepType === 'version' ? true : false,
        isJudgeRules: stepType === 'cras' ? true : false,
      });
    } else {
      form.resetFields();
    }
  }, [visible]);

  return { form, visible, onCloseDrawer, itemVisible, onSubmit, type };
}

function stepFormToReduxState(formData: FormRemoteJobStepsDrawer): RemoteJobStepDetailState {
  const {
    type,
    uuid,
    stepId,
    stepName,
    stepType,
    enable,
    mode,
    time,
    cycle,
    period,
    preStep,
    nextStep,
    isEmail,
    recipient,
    subject,
    body,
    selectJudgeRules,
    before,
    description,
    scriptType,
    script,
    fileIndices,
  } = formData;

  return {
    uuid: uuid ?? null,
    stepId: stepId ?? null,
    stepName,
    stepType,
    enable,
    mode: mode ?? null,
    time: time ?? [],
    cycle: cycle ?? null,
    period: period ?? null,
    preStep: preStep ?? null,
    nextStep: nextStep ?? null,
    isEmail,
    customEmails: recipient?.filter((item) => item.id <= 0).map((filtered) => filtered.email) ?? [],
    emailBook: recipient?.filter((item) => !item.group && item.id > 0) ?? [],
    groupBook: recipient?.filter((item) => item.group) ?? [],
    subject: subject ?? null,
    body: body ?? null,
    before: before ?? null,
    selectJudgeRules:
      selectJudgeRules?.map((item) => ({ enable: item.enable, itemId: item.itemId, itemName: item.itemName })) ?? [],
    description: description ?? null,
    scriptType: scriptType ?? null,
    script: script ?? null,
    fileIndices: fileIndices ?? [],
  };
}
