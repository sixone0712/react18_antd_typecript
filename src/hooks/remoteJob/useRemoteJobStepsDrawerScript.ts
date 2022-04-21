import { FormInstance } from 'antd';
import { saveAs } from 'file-saver';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { remoteJobVisibleReducer, selectRemoteJobVisible } from '../../reducers/slices/remoteJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { JobScriptType } from '../../types/Job';
import { FormRemoteJobStepsDrawer } from './useRemoteJobStepsDrawer';

export default function useRemoteJobStepsDrawerScript({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const dispatch = useDispatch();
  const [scriptType, setScriptTypeState] = useState<JobScriptType>('python');
  const isScript = useTypedSelector(selectRemoteJobVisible('isScript'));
  const isImportScript = useTypedSelector(selectRemoteJobVisible('isImportScript'));
  const script: string | null = form.getFieldValue('script') ?? null;

  const setIsScript = useCallback(
    (isScript: boolean) => {
      dispatch(
        remoteJobVisibleReducer({
          isScript,
        })
      );
    },
    [dispatch]
  );

  const setIsImportScript = useCallback(
    (isImportScript: boolean) => {
      dispatch(
        remoteJobVisibleReducer({
          isImportScript,
        })
      );
    },
    [dispatch]
  );

  const setScriptType = useCallback((value: JobScriptType) => {
    setScriptTypeState(value);
  }, []);

  const setScript = useCallback(
    (script: string | null) => {
      form.setFieldsValue({
        script,
      });
    },
    [form]
  );

  const onImport = useCallback(() => {
    dispatch(
      remoteJobVisibleReducer({
        isImportScript: true,
      })
    );
  }, [dispatch]);

  const onExport = useCallback(() => {
    const blob = new Blob([form.getFieldValue('script') ?? ''], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, scriptType === 'python' ? 'python_script.py' : 'shell_script.sh');
  }, [form, scriptType]);

  useEffect(() => {
    setScriptTypeState(form.getFieldValue('scriptType'));
  }, []);

  return {
    scriptType,
    setScriptType,
    script,
    setScript,
    isScript,
    setIsScript,
    isImportScript,
    setIsImportScript,
    onImport,
    onExport,
  };
}
