import queryString from 'query-string';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { getHistoryBuildList } from '../lib/api/axios/requests';
import { ResGetBuildHistoryList } from '../lib/api/axios/types';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { LOG_HISTORY_MAX_LIST_COUNT, PAGE_URL } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import {
  BuildHistorySelectedLogState,
  BuildHistorySelectedStepState,
  historyCurPageReducer,
  historyInitReducer,
  historySelectLogReducer,
  historySelectStepReudcer,
  selectHistoryCurPage,
  selectHistorySelectLog,
  selectHistorySelectStep,
} from '../reducers/slices/buildHistory';
import useTypedSelector from '../reducers/useTypedSelector';
import { JobStepType, JobType } from '../types/Job';

interface BuildHistoryParams {
  stepType: string;
  jobId: string;
}

export default function useBuildHistoryMenu() {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const { stepId, jobName, stepName, historyId } = queryString.parse(search);
  const { stepType, jobId } = useParams<BuildHistoryParams>();

  const paramInfo = useMemo<BuildHistorySelectedStepState>(
    () => ({
      stepId: stepId as string,
      jobName: jobName as string,
      stepName: stepName as string,
      stepType: stepType as JobStepType,
      jobId: jobId as string,
      type: getHistoryType(pathname),
      historyId: (historyId as string) ?? null,
    }),
    [stepId, jobName, stepName, stepType, jobId, pathname, historyId]
  );

  const selectedStep = useTypedSelector(selectHistorySelectStep);
  const selectedLog = useTypedSelector(selectHistorySelectLog);
  const currentPage = useTypedSelector(selectHistoryCurPage);

  const menuRef = useRef<HTMLDivElement>(null);
  const [doneToSetLog, setDoneToSetLog] = useState(false);

  const { data, isFetching } = useQuery<ResGetBuildHistoryList[]>(
    [QUERY_KEY.STATUS_BUILD_HISTORY, paramInfo.type, paramInfo.stepType, paramInfo.jobId, paramInfo.stepId],
    () =>
      getHistoryBuildList({
        jobId: selectedStep?.jobId as string,
        type: selectedStep?.type as JobType,
        stepId: selectedStep.stepId as string,
      }),
    {
      enabled: Boolean(selectedStep.stepId),
      onError: () => {
        openNotification('error', 'Error', `Failed to get build history list`);
      },
      onSuccess: (data) => {
        if (historyId) {
          let findIdx = -1;
          const findItem = data.find((item, idx) => {
            if (item.id === historyId) {
              findIdx = idx;
              return true;
            }
          });
          if (findIdx !== -1 && findItem) {
            const curPage = Math.floor((findIdx + 1) / LOG_HISTORY_MAX_LIST_COUNT) + 1;
            dispatch(historyCurPageReducer(curPage));
            dispatch(
              historySelectLogReducer({
                id: findItem.id,
                name: findItem.name,
                status: findItem.status,
              })
            );
            setDoneToSetLog(true);
          }
        }
      },
      onSettled: () => {
        setDoneToSetLog(true);
      },
    }
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      dispatch(historyCurPageReducer(page));
    },
    [dispatch]
  );

  const onChangeCurrentPage = useCallback(
    (page: number, pageSize?: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage]
  );
  const [historyList, setHistoryList] = useState<ResGetBuildHistoryList[]>([]);
  const totalHistoryListLen = useMemo(() => data?.length ?? 0, [data]);

  useEffect(() => {
    if (data?.length) {
      const startIdx = currentPage === 1 ? 0 : (currentPage - 1) * LOG_HISTORY_MAX_LIST_COUNT;
      const newLocal = startIdx + LOG_HISTORY_MAX_LIST_COUNT - 1;
      const endIdx = newLocal;
      setHistoryList(data.slice(startIdx, endIdx));
    } else {
      setHistoryList([]);
    }
  }, [currentPage, data]);

  const setSelectedLog = useCallback(
    (value: BuildHistorySelectedLogState) => {
      dispatch(historySelectLogReducer(value));
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      dispatch(historyInitReducer());
    };
  }, []);

  useEffect(() => {
    dispatch(historySelectStepReudcer(paramInfo));
  }, [paramInfo]);

  return {
    selectedLog,
    setSelectedLog,
    isFetching,
    currentPage,
    totalHistoryListLen,
    historyList,
    onChangeCurrentPage,
    menuRef,
    doneToSetLog,
    setDoneToSetLog,
  };
}

function getHistoryType(pathname: string): JobType {
  if (pathname.startsWith(PAGE_URL.STATUS_REMOTE_BUILD_HISTORY_TYPE)) {
    return 'remote';
  } else {
    return 'local';
  }
}
