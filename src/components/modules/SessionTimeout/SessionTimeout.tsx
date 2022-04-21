import { notification } from 'antd';
import moment from 'moment';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useThrottledCallback } from 'use-debounce/lib';
import { logout } from '../../../lib/api/axios/requests';
import { ACCESS_TOKEN_NAME, PAGE_URL, REFRESH_TOKEN_NAME, TOKEN_PATH } from '../../../lib/constants';
import { initLoginUser, LoginUserSelector } from '../../../reducers/slices/loginUser';
import useTypedSelector from '../../../reducers/useTypedSelector';
import { v4 as uuidv4 } from 'uuid';

const CHECK_INACTIVITY_MINUTE = 5;
export type SessionTimeoutProps = {};
export default function SessionTimeout({}: SessionTimeoutProps): JSX.Element {
  const dispatch = useDispatch();
  const history = useHistory();
  const [, , removeCookie] = useCookies([ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME]);
  const [events] = useState(['scroll', 'mousemove', 'keydown', 'click']); //load
  const { id: loginedId, timeout } = useTypedSelector(LoginUserSelector);
  const startTimerInterval = useRef<NodeJS.Timeout | null>(null);

  // start inactive check
  const timeChecker = () => {
    startTimerInterval.current = setInterval(() => {
      const storedTimeStamp = sessionStorage.getItem('lastTimeStamp');
      const maxTime = timeout; // Maximum ideal time given before logout

      const diff = moment.duration(moment().diff(moment(storedTimeStamp, 'YYYY-MM-DD HH:mm:ss')));
      const minPast = diff.minutes();

      if (minPast >= maxTime) {
        clearSessionTimeout();
        // your logout function here
        removeCookie(ACCESS_TOKEN_NAME, { path: TOKEN_PATH });
        removeCookie(REFRESH_TOKEN_NAME, { path: TOKEN_PATH });
        dispatch(initLoginUser);
        logout();
        history.replace(PAGE_URL.LOGIN_ROUTE);
        const key = uuidv4();
        notification.info({
          message: 'Session Timout',
          description: `You have been logged out due to inactivity for ${timeout} minutes.`,
          duration: 0,
          key,
          onClick: () => notification.close(key),
        });
      }
    }, CHECK_INACTIVITY_MINUTE);
  };

  const resetEventTime = () => {
    if (loginedId > 0) {
      sessionStorage.setItem('lastTimeStamp', moment().format('YYYY-MM-DD HH:mm:ss'));
    }
  };

  const resetEventTimeThrottled = useThrottledCallback(resetEventTime, 1000);

  const clearSessionTimeout = () => {
    events.forEach((event) => {
      window.removeEventListener(event, resetEventTimeThrottled);
    });
    sessionStorage.removeItem('lastTimeStamp');
    clearInterval(startTimerInterval.current as NodeJS.Timeout);
  };

  useEffect(() => {
    if (loginedId > 0) {
      events.forEach((event) => {
        window.addEventListener(event, resetEventTimeThrottled);
      });
      resetEventTime();
      timeChecker();
    } else {
      clearSessionTimeout();
    }
    return () => clearSessionTimeout();
  }, [loginedId]);

  return <Fragment />;
}
