import { useForm } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { postUser } from '../lib/api/axios/requests';
import { ReqUser } from '../lib/api/axios/types';
import md5 from '../lib/api/md5';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { ERROR_MESSAGE } from '../lib/constants';
import { rolesToObject } from '../lib/util/convertUserRoles';
import { openNotification } from '../lib/util/notification';
import { initialRolesState, LoginUserSelector, UserRolesBoolean } from '../reducers/slices/loginUser';

interface UseAddUserProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormAddUser {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function useAddUser({ visible, setVisible }: UseAddUserProps) {
  const [localRules, setLocalRules] = useState<UserRolesBoolean>({ ...initialRolesState });
  const loggedInUser = useSelector(LoginUserSelector);
  const queryClient = useQueryClient();
  const [form] = useForm<FormAddUser>();

  const { mutate: mutateAddUser, isLoading: isFetching } = useMutation((reqData: ReqUser) => postUser(reqData), {
    mutationKey: MUTATION_KEY.ACCOUNT_ADD_USER,
    onError: (error: AxiosError) => {
      const { message } = error.response?.data;
      openNotification('error', 'Error', 'Failed to add user', error);
      if (message !== ERROR_MESSAGE.DUPLICATE_USERNAME) {
        setVisible(false);
      }
    },
    onSuccess: () => {
      openNotification('success', 'Success', 'Succeed to add user.');
      setVisible(false);
      refreshUsers();
    },
  });

  const requestAddUser = useCallback(
    (reqData: ReqUser) => {
      mutateAddUser(reqData);
    },
    [mutateAddUser]
  );

  const refreshUsers = useCallback(() => {
    queryClient.prefetchQuery([QUERY_KEY.ACCOUNT_USERS]);
  }, [queryClient]);

  const handleOk = useCallback(
    async (data: FormAddUser) => {
      requestAddUser({
        username: data.username,
        password: md5(data.password),
        roles: rolesToObject(localRules),
      });
    },
    [localRules]
  );

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setLocalRules({ ...initialRolesState });
    }
  }, [visible]);

  return {
    localRules,
    setLocalRules,
    loggedInUser,
    form,
    handleOk,
    handleCancel,
    isFetching,
  };
}
