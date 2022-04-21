import { useForm } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getAddressGroupListInEmail, postAddressAddEmail, putAddressEditEmail } from '../lib/api/axios/requests';
import { AddressInfo } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { ERROR_MESSAGE } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import {
  AddressEditEmailSelector,
  AddressVisibleEmailModalSelector,
  DEFAULT_ALL_ADDRESS_KEY,
  DEFAULT_ALL_ADDRESS_NAME,
  setSelectGorupReducer,
  setVisibleEmailModalReducer,
} from '../reducers/slices/address';

export interface FormAddEditEmail {
  name: string;
  email: string;
  groupIds: number[] | undefined;
}

export default function useAddressBookAddEditEmail() {
  const queryClient = useQueryClient();
  const [form] = useForm<FormAddEditEmail>();
  const groupList = queryClient.getQueryData<AddressInfo[]>([QUERY_KEY.ADDRESS_GROUPS]);
  const dispatch = useDispatch();
  const editEmail = useSelector(AddressEditEmailSelector);
  const visible = useSelector(AddressVisibleEmailModalSelector);
  const setVisible = useCallback(
    (visible: boolean) => {
      dispatch(setVisibleEmailModalReducer(visible));
    },
    [dispatch]
  );

  const { data: groupsInEmail, isFetching: isFetchingGroups } = useQuery<AddressInfo[], AxiosError>(
    [QUERY_KEY.ADDRESS_GROUPS_IN_EMAIL, editEmail?.id],
    () => getAddressGroupListInEmail(editEmail!.id),
    {
      initialData: [],
      placeholderData: [],
      enabled: editEmail?.id ? true : false,
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of group in ${editEmail?.name}`, error);
      },
      onSuccess: (res: AddressInfo[]) => {
        form.setFieldsValue({ groupIds: res.map((item) => item.id) });
      },
    }
  );

  const { mutate: mutateAddEditEmail, isLoading: isFetchingAddEditEmail } = useMutation(
    (reqData: FormAddEditEmail) =>
      editEmail ? putAddressEditEmail({ id: editEmail.id, ...reqData }) : postAddressAddEmail(reqData),
    {
      mutationKey: MUTATION_KEY.ADDRESS_ADD_EDIT_EMAIL,
      onError: (error: AxiosError) => {
        const { message } = error.response?.data;
        const actionName = editEmail ? 'edit' : ' add';
        openNotification('error', 'Error', `Failed to ${actionName} email`, error);
        if (message !== ERROR_MESSAGE.DUPLICATE_USERNAME) {
          setVisible(false);
        }
      },
      onSuccess: () => {
        const actionName = editEmail ? 'edit' : ' add';
        openNotification('success', 'Success', `Succeed to ${actionName} email.`);
        dispatch(setSelectGorupReducer({ id: DEFAULT_ALL_ADDRESS_KEY, name: DEFAULT_ALL_ADDRESS_NAME }));
        queryClient.refetchQueries([QUERY_KEY.ADDRESS_EMAILS, DEFAULT_ALL_ADDRESS_KEY]);
        setVisible(false);
      },
    }
  );

  const requestAddEditAddress = useCallback(
    (reqData: FormAddEditEmail) => {
      mutateAddEditEmail(reqData);
    },
    [mutateAddEditEmail]
  );

  const handleOk = useCallback(async (data: FormAddEditEmail) => {
    requestAddEditAddress({
      name: data.name,
      email: data.email,
      groupIds: data.groupIds ?? [],
    });
  }, []);

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      if (!editEmail) {
        // add address
        form.resetFields();
      } else {
        // edit address
        form.setFieldsValue({
          name: editEmail.name,
          email: editEmail.email,
          groupIds: [],
        });
        queryClient.refetchQueries([QUERY_KEY.ADDRESS_GROUPS_IN_EMAIL, editEmail.id]);
      }
    }
  }, [visible]);

  return {
    form,
    handleOk,
    handleCancel,
    isFetchingAddEditEmail,
    groupList,
    visible,
    editEmail,
    isFetchingGroups,
  };
}
