import { FormInstance, RadioChangeEvent } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { remoteJobVisibleReducer, selectRemoteJobVisible } from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { BEFORE_CRAS_VERSION_DEF_VALUE, BEFORE_SUMMARY_DEF_VALUE, JobStepType } from '../../types/Job';
import { initialCurrentStep } from './useRemoteJobSteps';
import { FormRemoteJobStepsDrawer } from './useRemoteJobStepsDrawer';

export default function useRemoteJobStepsModalAdd({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const dispatch = useDispatch();
  const visible = useTypedSelector(selectRemoteJobVisible('isAddStep'));
  const [stepType, setStepTypeState] = useState<JobStepType | null>(null);

  const onNext = useCallback(() => {
    if (stepType) {
      let before: number | null = null;
      let isEmail = false;

      switch (stepType) {
        case 'summary':
          before = BEFORE_SUMMARY_DEF_VALUE;
          isEmail = true;
          break;
        case 'cras':
        case 'version':
          before = BEFORE_CRAS_VERSION_DEF_VALUE;
          isEmail = true;
          break;
        case 'notice':
          isEmail = true;
          break;
        default:
          break;
      }

      form.setFieldsValue({
        ...initialCurrentStep,
        stepType,
        before,
        isEmail,
      });
      dispatch(
        remoteJobVisibleReducer({
          isAddStep: false,
          isStep: true,
        })
      );
    } else {
      dispatch(
        remoteJobVisibleReducer({
          isAddStep: false,
        })
      );
    }
  }, [dispatch, form, stepType]);

  const onCancel = useCallback(() => {
    dispatch(
      remoteJobVisibleReducer({
        isAddStep: false,
      })
    );
  }, [dispatch]);

  const setStepType = useCallback((e: RadioChangeEvent) => {
    setStepTypeState(e.target.value as JobStepType | null);
  }, []);

  useEffect(() => {
    if (visible) {
      setStepTypeState(null);
    }
  }, [visible]);

  return {
    visible,
    onNext,
    onCancel,
    stepType,
    setStepType,
  };
}
