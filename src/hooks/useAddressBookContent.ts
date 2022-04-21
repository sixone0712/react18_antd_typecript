import { Modal } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { AxiosError } from 'axios';
import React, { Key, useCallback, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { deleteAddressEmail, getAddressEmailList, searchAddressEmail } from '../lib/api/axios/requests';
import { AddressInfo } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import {
  AddressGroupSelector,
  DEFAULT_ALL_ADDRESS_KEY,
  DEFAULT_ALL_ADDRESS_NAME,
  DEFAULT_SEARCHED_NAME,
  setEditEmailReducer,
  setSelectGorupReducer,
  setVisibleEmailModalReducer,
} from '../reducers/slices/address';
import { AddressOption } from '../types/address';

export default function useAddressBookContent() {
  const { id: selectedGroupId, name: selectedGroupName, keyword: searchedKeyword } = useSelector(AddressGroupSelector);
  const [searchResult, setSearchResult] = useState<AddressOption[]>([]);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [selectEmail, setSelectEmail] = useState<Key[]>([]);
  const selectRef = useRef<any>(null);

  const setVisibleEmailModal = useCallback(
    (visible: boolean) => {
      dispatch(setVisibleEmailModalReducer(visible));
    },
    [dispatch]
  );

  const deboundcedSearch = useDebouncedCallback((value: string, callback: any) => {
    if (!value) {
      setSearchResult([]);
      callback([]);
    } else {
      searchAddressEmail(value)
        .then((res) => {
          const newList = res.map((item) => ({
            ...item,
            label: `${item.name} <${item.email}>`,
            value: `${item.id}`,
          }));

          setSearchResult(newList);
          callback(newList);
        })
        .catch((error) => {
          openNotification('error', 'Error', `Failed to response the list of address`, error);
        });
    }
  }, 300);

  const handleChange = useCallback(
    (value: any) => {
      const { id, name, email, group } = value;
      dispatch(setSelectGorupReducer({ id: DEFAULT_ALL_ADDRESS_KEY, name: DEFAULT_SEARCHED_NAME, keyword: undefined }));
      queryClient.setQueriesData([QUERY_KEY.ADDRESS_EMAILS, DEFAULT_ALL_ADDRESS_KEY], [{ id, name, email, group }]);
      setSearchResult([]);
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (value: string) => {
      dispatch(setSelectGorupReducer({ id: DEFAULT_ALL_ADDRESS_KEY, name: DEFAULT_SEARCHED_NAME, keyword: value }));
      queryClient.setQueriesData([QUERY_KEY.ADDRESS_EMAILS, DEFAULT_ALL_ADDRESS_KEY], searchResult);
      setSearchResult([]);
    },
    [dispatch, searchResult]
  );

  const { data: addressList, isFetching: isFetchingAddress } = useQuery<AddressInfo[], AxiosError>(
    [QUERY_KEY.ADDRESS_EMAILS, selectedGroupId],
    () => getAddressEmailList(selectedGroupId),
    {
      initialData: [],
      enabled: selectedGroupId && selectedGroupName !== DEFAULT_SEARCHED_NAME ? true : false,
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of address`, error);
      },
    }
  );

  const { mutateAsync: mutateAsyncDeleteEmail } = useMutation((emailIds: number[]) => deleteAddressEmail(emailIds), {
    mutationKey: MUTATION_KEY.ADDRESS_DELETE_EMAIL,
  });

  const onSelectRow = useCallback(
    (record: AddressInfo) => {
      let newselectedRowKeys;
      if (selectEmail.find((item) => item === record.id)) {
        newselectedRowKeys = selectEmail.filter((item) => item !== record.id);
      } else {
        newselectedRowKeys = selectEmail.concat(record.id);
      }
      setSelectEmail(newselectedRowKeys);
    },
    [selectEmail]
  );

  const rowSelection: TableRowSelection<AddressInfo> = useMemo(
    () => ({
      selectedRowKeys: selectEmail,
      // onChange: (selectedRowKeys: React.Key[], selectedRows: AddressInfo[]) => {
      //   setSelectEmail(selectedRowKeys);
      // },
      onSelect: onSelectRow,
      hideSelectAll: true,
    }),
    [selectEmail, onSelectRow]
  );

  const onRow = useCallback(
    (record: AddressInfo, rowIndex: number | undefined) => ({
      onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        onSelectRow(record);
      },
    }),
    [onSelectRow]
  );

  const openEmailModal = useCallback(
    (editEmail?: AddressInfo | undefined) => {
      setVisibleEmailModal(true);
      dispatch(setEditEmailReducer(editEmail));
    },
    [dispatch, setVisibleEmailModal]
  );

  const refreshGroupEmailList = useCallback(() => {
    queryClient.prefetchQuery([QUERY_KEY.ADDRESS_GROUPS]);
    queryClient.prefetchQuery([QUERY_KEY.ADDRESS_EMAILS, DEFAULT_ALL_ADDRESS_KEY]);
    dispatch(setSelectGorupReducer({ id: DEFAULT_ALL_ADDRESS_KEY, name: DEFAULT_ALL_ADDRESS_NAME }));
  }, [dispatch, queryClient]);

  const refreshAddressList = useCallback(() => {
    if (selectedGroupId === DEFAULT_ALL_ADDRESS_KEY) {
      dispatch(
        setSelectGorupReducer({ id: DEFAULT_ALL_ADDRESS_KEY, name: DEFAULT_ALL_ADDRESS_NAME, keyword: undefined })
      );
    }

    queryClient.prefetchQuery([QUERY_KEY.ADDRESS_EMAILS, selectedGroupId]);
  }, [queryClient, selectedGroupId]);

  const openEmailDeleteModal = useCallback(() => {
    const confirm = Modal.confirm({
      className: 'delete_email',
      title: 'Delete Email',
      content: `Are you sure to delete seleted emails'?`,
      onOk: async () => {
        diableCancelBtn();
        try {
          await mutateAsyncDeleteEmail(selectEmail.map((item) => +item));
          openNotification('success', 'Success', `Succeed to delete emails.`);
        } catch (e) {
          console.error(e as AxiosError);
          openNotification('error', 'Error', `Failed to delete emails!`, e as AxiosError);
        } finally {
          refreshGroupEmailList();
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
  }, [mutateAsyncDeleteEmail, refreshGroupEmailList, selectEmail]);

  const onSelectEscKeyPress = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') selectRef.current.blur();
  }, []);

  return {
    addressList,
    isFetchingAddress,
    rowSelection,
    searchResult,
    handleChange,
    openEmailModal,
    selectedGroupId,
    selectedGroupName,
    searchedKeyword,
    openEmailDeleteModal,
    selectEmail,
    refreshAddressList,
    deboundcedSearch,
    handleCreate,
    onRow,
    selectRef,
    onSelectEscKeyPress,
  };
}
