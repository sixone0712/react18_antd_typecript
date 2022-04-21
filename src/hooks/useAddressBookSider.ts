import { Modal } from 'antd';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddressGroup, getAddressGroupList } from '../lib/api/axios/requests';
import { AddressInfo } from '../lib/api/axios/types';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import {
  AddressGroupSelector,
  AddressVisibleEmailModalSelector,
  AddressVisibleGroupModalSelector,
  DEFAULT_ALL_ADDRESS_KEY,
  DEFAULT_ALL_ADDRESS_NAME,
  initAddressStateReducer,
  setEditEmailReducer,
  setEditGroupReducer,
  setSelectGorupReducer,
  setVisibleEmailModalReducer,
  setVisibleGroupModalReducer,
} from '../reducers/slices/address';

export default function useAddressBookSider() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { id: currentSelect } = useSelector(AddressGroupSelector);
  const visibleEmailModal = useSelector(AddressVisibleEmailModalSelector);
  const setVisibleEmailModal = useCallback(
    (visible: boolean) => {
      dispatch(setVisibleEmailModalReducer(visible));
    },
    [dispatch]
  );
  const visibleGroupModal = useSelector(AddressVisibleGroupModalSelector);
  const setVisibleGroupModal = useCallback(
    (visible: boolean) => {
      dispatch(setVisibleGroupModalReducer(visible));
    },
    [dispatch]
  );
  const isExcuteModalInSelect = useRef(false);

  const { data: groups, isFetching: isFetchingGroups } = useQuery<AddressInfo[], AxiosError>(
    [QUERY_KEY.ADDRESS_GROUPS],
    getAddressGroupList,
    {
      initialData: [],
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of group`, error);
      },
    }
  );

  const onClickMenuItem = useCallback(
    ({ key }: { key: React.Key }) => {
      if (!isExcuteModalInSelect.current) {
        if (+key === DEFAULT_ALL_ADDRESS_KEY) {
          dispatch(setSelectGorupReducer({ id: +key, name: DEFAULT_ALL_ADDRESS_NAME }));
        } else {
          const findGroup = groups?.find((item) => item.id === +key);
          if (findGroup) {
            const { id, name } = findGroup;
            dispatch(setSelectGorupReducer({ id, name }));
            queryClient.refetchQueries([QUERY_KEY.ADDRESS_EMAILS, id]);
          }
        }
      }
      isExcuteModalInSelect.current = false;
    },
    [groups, dispatch, setSelectGorupReducer, isExcuteModalInSelect]
  );

  const refreshEmailGroupList = useCallback(() => {
    queryClient.prefetchQuery([QUERY_KEY.ADDRESS_GROUPS]);
    queryClient.prefetchQuery([QUERY_KEY.ADDRESS_EMAILS, DEFAULT_ALL_ADDRESS_KEY]);
    dispatch(setSelectGorupReducer({ id: DEFAULT_ALL_ADDRESS_KEY, name: DEFAULT_ALL_ADDRESS_NAME }));
  }, [queryClient]);

  const refreshGroupList = useCallback(() => {
    isExcuteModalInSelect.current = true;
    refreshEmailGroupList();
  }, [refreshEmailGroupList, isExcuteModalInSelect]);

  const openEmailAddModal = useCallback(() => {
    setVisibleEmailModal(true);
    dispatch(setEditEmailReducer(undefined));
  }, [dispatch]);

  const openGroupAddModal = useCallback(() => {
    setVisibleGroupModal(true);
    dispatch(setEditGroupReducer(undefined));
  }, [dispatch]);

  const openGroupEditModal = useCallback(
    (editGroup: AddressInfo) => {
      isExcuteModalInSelect.current = true;
      setVisibleGroupModal(true);
      dispatch(setEditGroupReducer(editGroup));
    },
    [dispatch, isExcuteModalInSelect]
  );

  const openGroupDeleteModal = useCallback(
    (groupInfo: AddressInfo) => {
      isExcuteModalInSelect.current = true;
      const confirm = Modal.confirm({
        className: 'delete_group',
        title: 'Delete Group',
        content: `Are you sure to delete group '${groupInfo.name}'?`,
        onOk: async () => {
          diableCancelBtn();
          try {
            await deleteAddressGroup(groupInfo.id);
            openNotification('success', 'Success', `Succeed to delete group '${groupInfo.name}'!`);
          } catch (e) {
            console.error(e);
            openNotification('error', 'Error', `Failed to delete group '${groupInfo.name}'!`, e);
          } finally {
            refreshEmailGroupList();
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
    [refreshEmailGroupList, isExcuteModalInSelect]
  );

  useEffect(() => {
    dispatch(initAddressStateReducer());
  }, []);

  return {
    groups,
    isFetchingGroups,
    onClickMenuItem,
    visibleGroupModal,
    setVisibleGroupModal,
    visibleEmailModal,
    setVisibleEmailModal,
    currentSelect,
    openEmailAddModal,
    openGroupAddModal,
    openGroupEditModal,
    openGroupDeleteModal,
    refreshGroupList,
  };
}
