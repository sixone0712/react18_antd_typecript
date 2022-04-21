import { Modal } from 'antd';
import { AxiosError } from 'axios';
import queryString from 'query-string';
import { useCallback, useEffect } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  deleteCrasManualCreateDelete,
  deleteCrasManualJudgeDelete,
  getCrasManualCreateInfoList,
  getCrasManualCreateOption,
  getCrasManualJudgeInfoList,
  getCrasManualJudgeOption,
} from '../lib/api/axios/requests';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import {
  crasIdSelector,
  crasItemIdSelector,
  setCrasCreateFixedOption,
  setCrasDrawerTypeReducer,
  setCrasIdReducer,
  setCrasItemIdReducer,
  setCrasJudgeFixedOption,
  setCrasShowCreateDrawerReducer,
  setCrasShowJudgeDrawerReducer,
} from '../reducers/slices/crasData';
import { CrasDataCreateOption, CrasDataJudgeOption, CrasDataManualInfo } from '../types/crasData';

interface useCrasDataEditCreateProps {
  type: 'create' | 'judge';
}

interface RulesCrasEditParams {
  id: string;
}

export default function useCrasDataEdit({ type }: useCrasDataEditCreateProps) {
  const history = useHistory();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const selectId = useSelector(crasIdSelector);
  const selectItemId = useSelector(crasItemIdSelector);
  const { id } = useParams<RulesCrasEditParams>();
  const { search } = useLocation();
  const { name: siteName } = queryString.parse(search);

  const { data: createList, isFetching: isFetchingCreate, refetch: refetchCreateList } = useQuery<
    CrasDataManualInfo[],
    AxiosError
  >([QUERY_KEY.RULES_CRAS_MANUAL_CREATE_LIST, selectId], () => getCrasManualCreateInfoList(selectId as number), {
    initialData: [],
    placeholderData: [],
    enabled: type === 'create' && !!selectId,
    refetchOnWindowFocus: false,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to response the list of create cras data!`, error);
    },
  });

  const { data: judgeList, isFetching: isFetchingJudge, refetch: refetchJudgeList } = useQuery<
    CrasDataManualInfo[],
    AxiosError
  >([QUERY_KEY.RULES_CRAS_MANUAL_JUDGE_LIST, selectId], () => getCrasManualJudgeInfoList(selectId as number), {
    initialData: [],
    placeholderData: [],
    enabled: type === 'judge' && !!selectId,
    refetchOnWindowFocus: false,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to response the list of cras judge rules!`, error);
    },
  });

  useQueries([
    {
      queryKey: [QUERY_KEY.RULES_CRAS_MANUAL_CREATE_OPTION],
      queryFn: getCrasManualCreateOption,
      enabled: type === 'create' && !!selectId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        dispatch(setCrasCreateFixedOption(data as CrasDataCreateOption));
      },
    },
    {
      queryKey: [QUERY_KEY.RULES_CRAS_MANUAL_JUDGE_OPTION],
      queryFn: getCrasManualJudgeOption,
      refetchOnWindowFocus: false,
      enabled: type === 'judge' && !!selectId,
      onSuccess: (data) => {
        dispatch(setCrasJudgeFixedOption(data as CrasDataJudgeOption));
      },
    },
  ]);

  const { mutateAsync: deleteCreateMutateAsync, isLoading: isCreateDeleting } = useMutation(
    ({ id, itemId }: { id: number; itemId: number }) => deleteCrasManualCreateDelete(id, itemId),
    {
      mutationKey: MUTATION_KEY.RULES_CRAS_CREATE_DELETE,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to delete create cras data!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to delete create cras data');
      },
      onSettled: () => {
        //refetchCreateList();
        queryClient.invalidateQueries([QUERY_KEY.RULES_CRAS_MANUAL_CREATE_LIST, selectId], {
          exact: true,
        });
      },
    }
  );

  const { mutateAsync: deleteJudgeMutateAsync, isLoading: isJudgeDeleting } = useMutation(
    ({ id, itemId }: { id: number; itemId: number }) => deleteCrasManualJudgeDelete(id, itemId),
    {
      mutationKey: MUTATION_KEY.RULES_CRAS_JUDGE_DELETE,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to delete cras judge rules!`, error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to delete cras judge rules');
      },
      onSettled: () => {
        //refetchJudgeList();
        queryClient.invalidateQueries([QUERY_KEY.RULES_CRAS_MANUAL_JUDGE_LIST, selectId], { exact: true });
      },
    }
  );

  const openDeleteModal = useCallback(
    (itemId: number) => {
      const className = type === 'create' ? 'delete-cras-create-item' : 'delete-cras-judge-item';
      const title = type === 'create' ? 'Delete create cras data item' : 'Delete cras judge rules item';
      const content =
        type === 'create'
          ? 'Are you sure to delete create cras data item?'
          : 'Are you sure to delete cras judge rules item?';
      const confirm = Modal.confirm({
        className,
        title,
        content,
        onOk: async () => {
          try {
            if (type === 'create') {
              await deleteCreateMutateAsync({ id: selectId as number, itemId: itemId });
            } else {
              await deleteJudgeMutateAsync({ id: selectId as number, itemId: itemId });
            }
          } catch (e) {
            console.error(e);
          }
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
    [type, selectId, deleteCreateMutateAsync, deleteJudgeMutateAsync]
  );

  const openEditModal = useCallback(
    (itemId: number) => {
      const confirm = Modal.confirm({
        className: type === 'create' ? 'edit-cras-data-create' : 'edit-cras-data-judge',
        title: type === 'create' ? 'Edit Create Cras Data Item' : 'Edit Cras Data Judge Rules Item',
        content:
          type === 'create'
            ? 'Are you sure to edit create cras data item?'
            : 'Are you sure to edit cras data judge rules item?',
        onOk: () => {
          dispatch(setCrasDrawerTypeReducer('edit'));
          dispatch(setCrasItemIdReducer(itemId));
          if (type === 'create') {
            dispatch(setCrasShowCreateDrawerReducer(true));
          } else {
            dispatch(setCrasShowJudgeDrawerReducer(true));
          }
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
    [type, dispatch]
  );

  const openAddModal = useCallback(() => {
    dispatch(setCrasDrawerTypeReducer('add'));
    dispatch(setCrasItemIdReducer(undefined));
    if (type === 'create') {
      dispatch(setCrasShowCreateDrawerReducer(true));
    } else {
      dispatch(setCrasShowJudgeDrawerReducer(true));
    }
  }, [type, dispatch]);

  const refreshList = useCallback(() => {
    if (type === 'create') {
      refetchCreateList();
      //queryClient.fetchQuery([QUERY_KEY.RULES_CRAS_GET_MANUAL_CREATE, selectId]);
    } else {
      refetchJudgeList();
      //queryClient.fetchQuery([QUERY_KEY.RULES_CRAS_GET_MANUAL_JUDGE, selectId]);
    }
  }, [type, queryClient, selectId]);

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    dispatch(setCrasIdReducer(+id ?? undefined));
  }, [id]);

  return {
    manualList: type === 'create' ? createList : judgeList,
    isFetchingList: type === 'create' ? isFetchingCreate : isFetchingJudge,
    openDeleteModal,
    openEditModal,
    openAddModal,
    refreshList,
    goBack,
    siteName,
  };
}
