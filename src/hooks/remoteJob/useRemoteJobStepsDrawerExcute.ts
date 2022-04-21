import { FormInstance, RadioChangeEvent } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { selectRemoteJobStepKeys } from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { JobModeType } from '../../types/Job';
import { FormRemoteJobStepsDrawer } from './useRemoteJobStepsDrawer';

export default function useRemoteJobStepsDrawerExcute({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const [timeMoment, setTimeMoment] = useState<moment.Moment | null>(null);
  const [time, setTime] = useState<string[]>([]);
  const [mode, setMode] = useState<JobModeType>('time');
  const stepUuids = useTypedSelector(selectRemoteJobStepKeys);
  const [uuid, setUuid] = useState<string | null>(null);

  const onChangeTime = useCallback(
    (time: string[]) => {
      setTime(time);
      form.setFieldsValue({
        time,
      });
    },
    [form]
  );

  const onChangeTimeMoment = useCallback(
    (value: moment.Moment | null, dateString: string) => {
      if (time.findIndex((item) => item === dateString) === -1) {
        onChangeTime([...time, dateString]);
      }
      setTimeMoment(null);
    },
    [time, onChangeTime]
  );

  const setExcuteMode = useCallback(
    (e: RadioChangeEvent) => {
      setMode(e.target.value);
      if (e.target.value === 'cycle') {
        if (!form.getFieldValue('cycle')) {
          form.setFieldsValue({
            cycle: 'day',
          });
        }
      }
    },
    [form]
  );

  useEffect(() => {
    setMode(form.getFieldValue('mode') ?? 'time');
    setTime(form.getFieldValue('time') ?? []);
    setUuid(form.getFieldValue('uuid') ?? null);
  }, []);

  return { excuteMode: mode, setExcuteMode, timeMoment, onChangeTimeMoment, time, onChangeTime, stepUuids, uuid };
}
