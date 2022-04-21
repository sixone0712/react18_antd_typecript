import { Modal } from 'antd';
import { AxiosError } from 'axios';
import { saveAs } from 'file-saver';
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  deleteConvertDeleteLog,
  getConvertExportFile,
  getConvertItemList,
  getStatusSiteList,
} from '../lib/api/axios/requests';
import { ResGetSiteName } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { PAGE_URL } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import {
  convertFilterRuleTypeSelector,
  convertSearchSelector,
  initConvert,
  setConvertErrorLogIdReducer,
  setConvertFilterRuleTypeReducer,
  setConvertInfo,
  setConvertSearchReducer,
  setConvertShowAddReducer,
  setConvertShowEditReducer,
  setConvertShowErrorReducer,
  setConvertShowImportReducer,
} from '../reducers/slices/convert';
import { ConvertRuleItem } from '../types/convertRules';

export default function useConvert() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { data: siteNameList, isFetching: isFetchingSiteNameList, refetch: refetchSiteNameList } = useQuery<
    ResGetSiteName[],
    AxiosError
  >([QUERY_KEY.STATUS_SITE_LIST], getStatusSiteList, {
    initialData: [],
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to response the list of conver rule(user-fab name)`, error);
    },
  });
  const searchText = useSelector(convertSearchSelector);
  const [search, setSearch] = useState<string | undefined>();
  const filterRuleType = useSelector(convertFilterRuleTypeSelector);

  const { data: itemlist, isFetching: isFetchingItemList, refetch: refetchItemList } = useQuery<
    ConvertRuleItem[],
    AxiosError
  >([QUERY_KEY.RULES_CONVERT_LIST], getConvertItemList, {
    initialData: [],
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', `Failed to response the list of conver rule`, error);
    },
  });

  const { mutate: deleteLog, isLoading: deleting } = useMutation(
    (logNameId: number) => deleteConvertDeleteLog(logNameId),
    {
      mutationKey: MUTATION_KEY.RULES_CONVERT_DELETE_LOG,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to delete log!`, error);
      },
      onSuccess: () => {
        refreshItemList();
      },
    }
  );

  const getComapnyFabName = useCallback(
    (siteId: number) => {
      const foundSite = siteNameList?.find((item) => item.siteId === siteId);
      return foundSite ? foundSite.crasCompanyFabName : 'not found';
    },
    [siteNameList]
  );

  const showAddModal = useCallback(() => {
    dispatch(setConvertShowAddReducer(true));
  }, [dispatch]);

  const showImportModal = useCallback(() => {
    dispatch(setConvertShowImportReducer(true));
  }, [dispatch]);

  const refreshItemList = useCallback(() => {
    refetchSiteNameList();
    refetchItemList();
  }, []);

  const onClickEdit = useCallback(
    (type: 'log' | 'rule', id: number, name: string) => {
      dispatch(
        setConvertInfo({
          log_name_id: id,
          log_name: name,
        })
      );
      if (type === 'log') {
        dispatch(setConvertShowEditReducer(true));
      } else {
        history.push(PAGE_URL.RULES_CONVERT_RULES_EDIT(id as number, name as string));
      }
    },
    [history, dispatch]
  );

  const onClickDelete = useCallback(
    (id: number, name: string) => {
      deleteLog(id);
    },
    [deleteLog]
  );

  const openExportModal = () => {
    const confirm = Modal.confirm({
      className: 'export-convert-rules',
      title: 'Export Convert Rules',
      content: 'Are you sure to export convert rules?',
      onOk: async () => {
        diableCancelBtn();
        try {
          const { data, fileName } = await getConvertExportFile();
          saveAs(data, fileName);
          openNotification('success', 'Success', `Succeed to export convert rules '${fileName}'.`);
        } catch (e) {
          console.error(e);
          openNotification('error', 'Error', 'Failed to export convert rules!');
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
  };

  const onPressEnter = useCallback(() => {
    dispatch(setConvertSearchReducer(search));
  }, [dispatch, search]);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (!e.target.value) {
        dispatch(setConvertSearchReducer(undefined));
      }
      setSearch(e.target.value);
    },
    [dispatch]
  );

  const filteredItemList = useMemo(() => {
    if (!itemlist || !searchText || searchText === '') {
      return itemlist?.filter((item) => (filterRuleType === 'all' ? true : item.rule_type === filterRuleType)) ?? [];
    } else {
      return itemlist.filter((item) => {
        if (item.log_name.toLowerCase().includes(searchText.toLowerCase())) {
          if (filterRuleType === 'all') {
            return true;
          } else if (item.rule_type === filterRuleType) {
            return true;
          }
        }

        return false;
      });
    }
  }, [searchText, itemlist, filterRuleType]);

  const onSelectFilterRuleType = useCallback(
    (value: 'all' | 'csv' | 'regex') => {
      dispatch(setConvertFilterRuleTypeReducer(value));
    },
    [dispatch]
  );

  const onClickErrorMsg = useCallback(
    (id: number) => {
      dispatch(setConvertErrorLogIdReducer(id));
      dispatch(setConvertShowErrorReducer(true));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(initConvert());
  }, []);

  return {
    itemlist,
    isFetching: isFetchingItemList || isFetchingSiteNameList || deleting,
    refreshItemList,
    getComapnyFabName,
    showAddModal,
    showImportModal,
    onClickEdit,
    onClickDelete,
    openExportModal,
    search,
    onChange,
    onPressEnter,
    filteredItemList,
    filterRuleType,
    onSelectFilterRuleType,
    onClickErrorMsg,
  };
}
