import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { putUserRoles } from '../lib/api/axios/requests';
import { ReqUserRoles } from '../lib/api/axios/types';
import { MUTATION_KEY } from '../lib/api/query/mutationKey';
import { QUERY_KEY } from '../lib/api/query/queryKey';
import { rolesToObject } from '../lib/util/convertUserRoles';
import { openNotification } from '../lib/util/notification';
import { initialRolesState, LoginUserSelector, UserRolesBoolean } from '../reducers/slices/loginUser';

interface UseAccountEditPermissionProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  rules: UserRolesBoolean;
}

export default function useAccountEditPermission({ visible, setVisible, id, rules }: UseAccountEditPermissionProps) {
  const [localId, setLocalId] = useState(0);
  const [localRules, setLocalRules] = useState<UserRolesBoolean>({ ...initialRolesState });
  const loggedInUser = useSelector(LoginUserSelector);
  const queryClient = useQueryClient();

  const { mutate: mutateEditRoles, isLoading: isFetching } = useMutation(
    (reqData: ReqUserRoles) => putUserRoles(localId, reqData),
    {
      mutationKey: MUTATION_KEY.ACCOUNT_EDIT_PERMISSION,
      onError: (error: AxiosError) => {
        openNotification('error', 'Error', 'Failed to change permission!', error);
      },
      onSuccess: () => {
        openNotification('success', 'Success', 'Succeed to change permission.');
      },
      onSettled: () => {
        setVisible(false);
        refreshUsers();
      },
    }
  );

  const refreshUsers = useCallback(() => {
    queryClient.prefetchQuery([QUERY_KEY.ACCOUNT_USERS]);
  }, [queryClient]);

  const handleOk = useCallback(() => {
    mutateEditRoles({ roles: rolesToObject(localRules) });
  }, [localRules]);

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      setLocalRules(rules);
      setLocalId(id);
    }
  }, [visible]);

  return {
    localRules,
    setLocalRules,
    loggedInUser,
    handleOk,
    handleCancel,
    isFetching,
  };
}
