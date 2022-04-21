import { useForm } from 'antd/lib/form/Form';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { putUserPassword } from '../lib/api/axios/requests';
import { ReqUserPassword } from '../lib/api/axios/types';
import md5 from '../lib/api/md5';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { ERROR_MESSAGE } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import { LoginUserSelector } from '../reducers/slices/loginUser';

interface UseAddUserProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FormAddUser {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function useAccountChangePassword({ visible, setVisible }: UseAddUserProps) {
  const loggedInUser = useSelector(LoginUserSelector);
  const [form] = useForm<FormAddUser>();

  const { mutate: mutateChangePw, isLoading: isFetching } = useMutation(
    (reqData: ReqUserPassword) => putUserPassword(loggedInUser.id, reqData),
    {
      mutationKey: MUTATION_KEY.ACCOUNT_CHANGE_PASSWORD,
      onError: (error: AxiosError) => {
        const { message } = error.response?.data;
        openNotification('error', 'Error', 'Failed to change password!', error);
        if (message !== ERROR_MESSAGE.INVALID_CURRENT_PASSWORD) {
          setVisible(false);
        }
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to change password.');
        setVisible(false);
      },
    }
  );

  const handleOk = useCallback(
    (data: FormAddUser) => {
      mutateChangePw({
        currentPassword: md5(data.currentPassword),
        newPassword: md5(data.newPassword),
      });
    },
    [mutateChangePw]
  );

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  return {
    loggedInUser,
    form,
    handleOk,
    handleCancel,
    isFetching,
  };
}
