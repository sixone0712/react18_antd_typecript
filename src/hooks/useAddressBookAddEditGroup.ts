import { useForm } from 'antd/lib/form/Form';
import { TransferDirection } from 'antd/lib/transfer';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getAddressEmailList, postAddressAddGroup, putAddressEditGroup } from '../lib/api/axios/requests';
import { AddressInfo } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { ERROR_MESSAGE } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import {
  AddressEditGroupSelector,
  AddressVisibleGroupModalSelector,
  DEFAULT_ALL_ADDRESS_KEY,
  DEFAULT_ALL_ADDRESS_NAME,
  setSelectGorupReducer,
  setVisibleGroupModalReducer,
} from '../reducers/slices/address';
import { TransferAddressBook } from '../types/address';

export interface FormAddEditGroup {
  name: string;
  emailIds: number[] | undefined;
}
export default function useAddressBookAddEditGroup() {
  const queryClient = useQueryClient();
  const [form] = useForm<FormAddEditGroup>();
  const groupList = queryClient.getQueryData<AddressInfo[]>([QUERY_KEY.ADDRESS_GROUPS]);
  const dispatch = useDispatch();
  const [targetKeys, setTargetKeys] = useState<string[] | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const editGroup = useSelector(AddressEditGroupSelector);
  const visible = useSelector(AddressVisibleGroupModalSelector);
  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(setVisibleGroupModalReducer(visible));
    },
    [dispatch]
  );

  const { data: allEmails, isFetching: isFetchingAddr } = useQuery<AddressInfo[], AxiosError>(
    [QUERY_KEY.ADDRESS_EMAILS, DEFAULT_ALL_ADDRESS_KEY],
    () => getAddressEmailList(DEFAULT_ALL_ADDRESS_KEY),
    {
      initialData: [],
      enabled: visible,
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of all address`, error);
      },
    }
  );

  const { data: emailsInGroup, isFetching: isFetchingGroup } = useQuery<AddressInfo[], AxiosError>(
    [QUERY_KEY.ADDRESS_EMAILS, editGroup?.id],
    () => getAddressEmailList(editGroup?.id),
    {
      initialData: [],
      placeholderData: [],
      enabled: editGroup?.id ? true : false,
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of address from'${editGroup?.name}'!`, error);
      },
      onSuccess: (res: AddressInfo[]) => {
        setTargetKeys(res?.map((item) => item.id.toString()));
        form.setFieldsValue({ emailIds: res.map((item) => +item.id) });
      },
    }
  );

  const addressList: TransferAddressBook[] = useMemo(
    () =>
      allEmails?.map((item) => ({
        key: item.id.toString(),
        ...item,
      })) ?? [],
    [allEmails]
  );

  const { mutate: mutateAddEditGroup, isLoading: isFetchingAddEdit } = useMutation(
    (reqData: FormAddEditGroup) =>
      editGroup ? putAddressEditGroup({ id: editGroup.id, ...reqData }) : postAddressAddGroup(reqData),
    {
      mutationKey: MUTATION_KEY.ADDRESS_ADD_EDIT_GROUP,
      onError: (error: AxiosError) => {
        const { message } = error.response?.data;
        const actionName = editGroup ? 'edit' : ' add';
        openNotification('error', 'Error', `Failed to ${actionName} group`, error);
        if (message !== ERROR_MESSAGE.DUPLICATE_USERNAME) {
          setVisible(false);
        }
      },
      onSuccess: () => {
        const actionName = editGroup ? 'edit' : ' add';
        openNotification('success', 'Success', `Succeed to ${actionName} group.`);
        dispatch(setSelectGorupReducer({ id: DEFAULT_ALL_ADDRESS_KEY, name: DEFAULT_ALL_ADDRESS_NAME }));
        queryClient.prefetchQuery([QUERY_KEY.ADDRESS_GROUPS]);
        setVisible(false);
      },
    }
  );

  const requestAddGroup = useCallback(
    (reqData: FormAddEditGroup) => {
      mutateAddEditGroup(reqData);
    },
    [mutateAddEditGroup]
  );
  const handleOk = useCallback(
    (data: FormAddEditGroup) => {
      requestAddGroup({
        name: data.name,
        emailIds: data.emailIds ?? [],
      });
    },
    [requestAddGroup]
  );

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChange = (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => {
    setTargetKeys(targetKeys);
    form.setFieldsValue({ emailIds: targetKeys.map((item) => +item) });
  };

  const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  useEffect(() => {
    if (visible) {
      if (!editGroup) {
        // add group
        form.resetFields();
        setTargetKeys([]);
      } else {
        // edit group
        form.setFieldsValue({ name: editGroup.name });
      }
      setSelectedKeys([]);
    }
  }, [visible]);

  return {
    form,
    handleOk,
    handleCancel,
    groupList,
    addressList,
    targetKeys,
    setTargetKeys,
    handleChange,
    editGroup,
    isFetchingQuery: isFetchingAddr || isFetchingGroup,
    isFetchingAddEdit,
    selectedKeys,
    handleSelectChange,
    visible,
  };
}
