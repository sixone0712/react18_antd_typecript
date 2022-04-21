import { RadioChangeEvent } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../lib/constants';
import { selectHistorySelectLog, selectHistorySelectStep } from '../reducers/slices/buildHistory';
import useTypedSelector from '../reducers/useTypedSelector';

export default function useBuildHistoryViewLog() {
  const selectedStep = useTypedSelector(selectHistorySelectStep);
  const selectedLog = useTypedSelector(selectHistorySelectLog);
  const [serverType, setServerType] = useState<'logmonitor' | 'cras'>('logmonitor');
  const [requestUrl, setRequestUrl] = useState<string | undefined>(undefined);
  const status = useMemo(() => selectedLog?.status, [selectedLog?.status]);
  const name = useMemo(() => selectedLog?.name, [selectedLog?.name]);

  const onChangeServerType = useCallback((e: RadioChangeEvent) => {
    setServerType(e.target.value);
  }, []);

  useEffect(() => {
    if (selectedStep && selectedLog) {
      const { type, jobId, stepId, stepType } = selectedStep;
      const { id } = selectedLog;
      if (type && jobId && stepId && stepType && id) {
        setRequestUrl(
          API_URL.GET_STATUS_BUILD_HISTORY_LOG({
            type,
            jobId,
            stepId,
            historyId: id,
          })
        );
      } else {
        console.group();
        console.error('failed to get history log');
        console.log('type', type);
        console.log('jobId', jobId);
        console.log('stepType', stepType);
        console.log('stepId', stepId);
        console.log('id', id);
        console.groupEnd();
      }
    } else {
      setRequestUrl(undefined);
    }
  }, [selectedStep, selectedLog]);

  return {
    requestUrl,
    status,
    name,
    serverType,
    onChangeServerType,
  };
}
