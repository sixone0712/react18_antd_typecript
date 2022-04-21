import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { getMe } from '../lib/api/axios/requests';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME, SESSION_STORAGE_EXPIRED } from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import { setLoginUser } from '../reducers/slices/loginUser';

export default function useValidateLogin() {
  const [cookies] = useCookies([ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME]);
  const dispatch = useDispatch();

  const vaildateToken = async (): Promise<boolean> => {
    const accessToken = cookies[ACCESS_TOKEN_NAME];
    const refreshToken = cookies[REFRESH_TOKEN_NAME];
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);

    if (!accessToken || !refreshToken) {
      // history.push(PAGE_URL.LOGIN_ROUTE);
      if (window.sessionStorage.getItem(SESSION_STORAGE_EXPIRED) === 'true') {
        openNotification('info', 'Notice', ['Refresh token is expired.', 'Please log in again.']);
        window.sessionStorage.removeItem('expired');
      }
      return false;
    }

    try {
      const loginUserInfo = await getMe();
      if (loginUserInfo.id && loginUserInfo.roles && loginUserInfo.username) {
        dispatch(setLoginUser(loginUserInfo));
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  };

  return {
    vaildateToken,
  };
}
