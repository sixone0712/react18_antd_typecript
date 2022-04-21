import { Modal } from 'antd';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUsers, logout } from '../lib/api/axios/requests';
import { UserInfo } from '../lib/api/axios/types';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { openNotification } from '../lib/util/notification';
import { initialRolesState, initLoginUser, LoginUserSelector, UserRolesBoolean } from '../reducers/slices/loginUser';
import { useCookies } from 'react-cookie';
import { ACCESS_TOKEN_NAME, PAGE_URL, REFRESH_TOKEN_NAME, TOKEN_PATH } from '../lib/constants';
import { useHistory } from 'react-router';
export default function useAccountTable() {
  const dispatch = useDispatch();
  const history = useHistory();
  const loggedInUser = useSelector(LoginUserSelector);
  const [, , removeCookie] = useCookies([ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME]);
  const [visiblePermission, setVisiblePermission] = useState(false);
  const [visibleAddUser, setVisibleAddUser] = useState(false);
  const [id, setId] = useState(0);
  const [rules, setRules] = useState<UserRolesBoolean>({
    ...initialRolesState,
  });
  const { data: users, isFetching: isFetchingUsers, refetch: reFetchUsers } = useQuery<UserInfo[], AxiosError>(
    QUERY_KEY.ACCOUNT_USERS,
    getUsers,
    {
      initialData: [],
      refetchOnWindowFocus: false,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', `Failed to response the list of user account`, error);
      },
    }
  );
  const usersLen = users?.length ?? 0;

  const refreshUsers = useCallback(() => {
    reFetchUsers();
  }, [reFetchUsers]);

  const onLogout = useCallback(() => {
    removeCookie(ACCESS_TOKEN_NAME, { path: TOKEN_PATH });
    removeCookie(REFRESH_TOKEN_NAME, { path: TOKEN_PATH });
    dispatch(initLoginUser);
    logout();
    history.replace(PAGE_URL.LOGIN_ROUTE);
  }, [removeCookie, dispatch, history]);

  const openDeleteModal = useCallback(
    (id: number, name: string) => {
      const confirm = Modal.confirm({
        className: 'delete-account',
        title: 'Delete User',
        content: `Are you sure to delete user '${name}'?`,
        onOk: async () => {
          try {
            await deleteUser(id);
            if (id === loggedInUser.id) {
              onLogout();
            }
          } catch (e) {
            openNotification('error', 'Error', `Failed to delete user '${name}'!`, e as AxiosError);
          } finally {
            reFetchUsers();
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
    [loggedInUser, onLogout, reFetchUsers]
  );

  return {
    users,
    isFetchingUsers,
    refreshUsers,
    usersLen,
    visiblePermission,
    setVisiblePermission,
    visibleAddUser,
    setVisibleAddUser,
    rules,
    setRules,
    id,
    setId,
    openDeleteModal,
  };
}
