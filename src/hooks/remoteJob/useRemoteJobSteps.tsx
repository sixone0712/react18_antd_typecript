import { Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  remoteJobDeleteStepsInfoReducer,
  remoteJobStepsEnableReducer,
  remoteJobVisibleReducer,
  selectRemoteJobSteps,
  selectRemoteJobStepsEnable,
  selectRemoteJobVisible,
} from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { AddressOption } from '../../types/address';
import { RemoteJobStepDetailState, RemoteJobStepMilestone } from '../../types/Job';
import { FormRemoteJobStepsDrawer } from './useRemoteJobStepsDrawer';
import React from 'react';
export default function useRemoteJobStep() {
  const dispatch = useDispatch();
  const stepList = useTypedSelector(selectRemoteJobSteps);
  const enableList = useTypedSelector(selectRemoteJobStepsEnable);
  const [form] = useForm<FormRemoteJobStepsDrawer>();

  const isMilestone = useTypedSelector(selectRemoteJobVisible('isMileStone'));
  const stepMilestone = useMemo<RemoteJobStepMilestone[]>(
    () =>
      stepList.map((item) => ({
        stepName: item.stepName,
        stepType: item.stepType,
        uuid: item.uuid,
        mode: item.mode,
        time: item.time,
        cycle: item.cycle,
        period: item.period,
        preStep: item.preStep,
        nextStep: item.nextStep,
        enable: item.enable,
      })),
    [stepList]
  );

  const setEnableList = useCallback(
    (value: string[]) => {
      dispatch(remoteJobStepsEnableReducer(value));
    },
    [dispatch]
  );

  const onChangeEnable = (selectedRowKeys: React.Key[], selectedRows: RemoteJobStepDetailState[]) => {
    setEnableList(selectedRowKeys as string[]);
  };
  const onToggleAllEnable = useCallback(() => {
    if (stepList && stepList.length > 0)
      setEnableList(enableList.length === stepList.length ? [] : (stepList.map((item) => item.uuid) as string[]));
  }, [stepList, enableList, setEnableList]);

  const openEditStepDrawer = useCallback(
    (record: RemoteJobStepDetailState) => {
      form.setFieldsValue(convertResStepToFormStep(record));
      dispatch(
        remoteJobVisibleReducer({
          isStep: true,
        })
      );
    },
    [dispatch, form]
  );

  const openAddStepDrawer = useCallback(() => {
    dispatch(
      remoteJobVisibleReducer({
        isAddStep: true,
      })
    );
  }, [dispatch]);

  const openDeleteWarning = useCallback(
    ({ findItem, preItem }: { findItem: RemoteJobStepDetailState; preItem: RemoteJobStepDetailState[] }) => {
      const confirm = Modal.confirm({
        className: 'delete_step_warning',
        title: 'Warning Delete Step',
        content: (
          <div>
            <div>{`Deleted ${findItem.stepName} is the previous step of the following steps.`}</div>
            <div>Are you sure you want to delete it anyway?</div>
            <div>
              {preItem.map((item, idx) => (
                <div key={idx}>{`• ${item.stepName}`}</div>
              ))}
            </div>
          </div>
        ),
        onOk: () => {
          diableCancelBtn();
          dispatch(remoteJobDeleteStepsInfoReducer(findItem.uuid as string));
        },
      });

      const diableCancelBtn = () => {
        confirm.update({
          cancelButtonProps: {
            disabled: true,
          },
        });
      };
    },
    [dispatch]
  );

  const onDeleteStep = useCallback(
    (uuid: string) => {
      const findItem = stepList.find((item) => item.uuid === uuid);
      if (findItem) {
        const preItem = stepList.filter((item) => item.preStep === findItem.uuid);
        if (preItem.length === 0) {
          dispatch(remoteJobDeleteStepsInfoReducer(uuid));
        } else {
          openDeleteWarning({ findItem, preItem });
        }
      }
    },
    [dispatch, stepList, openDeleteWarning]
  );

  const setMilestone = useCallback(
    (value: boolean) => {
      dispatch(
        remoteJobVisibleReducer({
          isMileStone: value,
        })
      );
    },
    [dispatch]
  );

  return {
    stepList,
    enableList,
    setEnableList,
    onChangeEnable,
    onToggleAllEnable,
    openAddStepDrawer,
    openEditStepDrawer,
    onDeleteStep,
    form,
    stepMilestone,
    isMilestone,
    setMilestone,
  };
}

function convertResStepToFormStep(resStep: RemoteJobStepDetailState | null): FormRemoteJobStepsDrawer {
  if (!resStep) return initialCurrentStep;

  const {
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
    customEmails,
    emailBook,
    groupBook,
    subject,
    body,
    before,
    selectJudgeRules,
    description,
    scriptType,
    script,
    fileIndices,
  } = resStep;

  return {
    type: uuid ? 'edit' : 'add',
    uuid: uuid ?? null,
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
    recipient: convertRecipientState({ customEmails, emailBook, groupBook }),
    subject,
    body,
    selectJudgeRules: selectJudgeRules?.map((item) => ({ ...item, key: item.itemId.toString() })) || [],
    before,
    description,
    scriptType,
    script,
    fileIndices,
  };
}

export function convertRecipientState({
  groupBook,
  emailBook,
  customEmails,
}: {
  groupBook: AddressOption[] | null;
  emailBook: AddressOption[] | null;
  customEmails: string[] | null;
}): AddressOption[] {
  const newRecipients: AddressOption[] = [];
  if (groupBook && groupBook.length > 0) {
    groupBook.map((item) => {
      const { id, name, email, group } = item;
      newRecipients.push({
        id,
        name,
        email,
        group,
        label: `@${name}`,
        value: id.toString(),
      });
    });
  }

  if (emailBook && emailBook.length > 0) {
    emailBook.map((item) => {
      const { id, name, email, group } = item;
      newRecipients.push({
        id,
        name,
        email,
        group,
        label: `${name} <${email}>`,
        value: id.toString(),
      });
    });
  }

  if (customEmails && customEmails.length > 0) {
    customEmails.map((item) => {
      newRecipients.push({
        id: 0,
        name: item,
        email: item,
        group: false,
        label: item,
        value: item,
      });
    });
  }

  return newRecipients;
}

export const initialCurrentStep: FormRemoteJobStepsDrawer = {
  type: 'add',
  uuid: null,
  stepId: null,
  stepName: null,
  stepType: 'custom',
  enable: true,
  mode: 'time',
  time: [],
  cycle: null,
  period: null,
  preStep: null,
  nextStep: null,
  isEmail: false,
  recipient: [],
  subject: null,
  body: null,
  selectJudgeRules: [],
  before: null,
  description: null,
  scriptType: 'python',
  script: null,
  fileIndices: [],
};
