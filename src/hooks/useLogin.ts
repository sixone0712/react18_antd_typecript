import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../lib/api/axios/requests';
import { LoginUserInfo, ReqLogin } from '../lib/api/axios/types';
import md5 from '../lib/api/md5';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { PAGE_URL } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import { setLoginUser } from '../reducers/slices/loginUser';

export default function useLogin() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mutate: mutateLogin, isLoading: isMutateLogin } = useMutation((loginData: ReqLogin) => login(loginData), {
    mutationKey: MUTATION_KEY.AUTH_LOGIN,
    onError: (error: AxiosError) => {
      openNotification('error', 'Error', 'Failed to login.', error);
    },

    onSuccess: (loginUserInfo: LoginUserInfo) => {
      if (loginUserInfo.id && loginUserInfo.roles && loginUserInfo.username) {
        dispatch(setLoginUser(loginUserInfo));
        moveToRemoteStatus();
      } else {
        openNotification('error', 'Error', 'Failed to login.');
      }
    },
  });

  const requestLogin = useCallback(
    (loginData: ReqLogin) => {
      mutateLogin({
        ...loginData,
        password: md5(loginData.password),
      });
    },
    [mutateLogin]
  );

  const moveToRemoteStatus = () => {
    history.push(PAGE_URL.STATUS_REMOTE);
  };

  return {
    requestLogin,
    isMutateLogin,
    moveToRemoteStatus,
  };
}
