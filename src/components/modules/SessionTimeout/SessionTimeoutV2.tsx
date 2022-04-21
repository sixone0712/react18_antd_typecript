import { message, notification } from 'antd';
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
const CHECK_WARN_MESSAGE_MS = 1000; // 1 minute
const LAST_TIME_STAMP_KEY = 'lastTimeStamp';
const WARNING_SECOND = 3 * 60; // 3 minite
const WARNING_MESSEAGE_KEY = 'warning_timeout';
export type SessionTimeoutV2Props = {};
export default function SessionTimeoutV2({}: SessionTimeoutV2Props): JSX.Element {
  const dispatch = useDispatch();
  const history = useHistory();
  const [, , removeCookie] = useCookies([ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME]);
  const [events] = useState(['scroll', 'mousemove', 'keydown', 'click']); //load
  const { id: loginedId, timeout } = useTypedSelector(LoginUserSelector);
  const startTimerInterval = useRef<NodeJS.Timeout | null>(null);
  const warnTimerInterval = useRef<NodeJS.Timeout | null>(null);
  const warnSecond = useRef(WARNING_SECOND);

  const logoutProcess = () => {
    clearSessionTimeout();
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
  };

  // start inactive check
  const timeChecker = () => {
    startTimerInterval.current = setInterval(() => {
      const storedTimeStamp = sessionStorage.getItem(LAST_TIME_STAMP_KEY);
      const maxTime = timeout; // Maximum ideal time given before logout

      const diff = moment.duration(moment().diff(moment(storedTimeStamp, 'YYYY-MM-DD HH:mm:ss')));
      const minPast = diff.minutes();
      // const secPast = diff.seconds();

      if (minPast >= maxTime) {
        clearInterval(startTimerInterval.current as NodeJS.Timeout);
        startTimerInterval.current = null;
        warningChecker();
      }
    }, CHECK_INACTIVITY_MINUTE);
  };

  const warningChecker = () => {
    warnTimerInterval.current = setInterval(() => {
      if (warnSecond.current <= 0) {
        // logout
        logoutProcess();
      } else {
        message.warning({
          content: `You will be logged out due to inactivity after ${secondsToTime(warnSecond.current--)}.`,
          key: WARNING_MESSEAGE_KEY,
          duration: 0,
        });
      }
    }, CHECK_WARN_MESSAGE_MS);
  };

  const initEvnetTime = () => {
    clearInterval(startTimerInterval.current as NodeJS.Timeout);
    clearInterval(warnTimerInterval.current as NodeJS.Timeout);
    startTimerInterval.current = null;
    warnTimerInterval.current = null;
    warnSecond.current = WARNING_SECOND;
  };

  const resetEventTime = () => {
    if (loginedId > 0) {
      initEvnetTime();
      sessionStorage.setItem(LAST_TIME_STAMP_KEY, moment().format('YYYY-MM-DD HH:mm:ss'));
      message.destroy(WARNING_MESSEAGE_KEY);
      timeChecker();
    }
  };

  const resetEventTimeThrottled = useThrottledCallback(resetEventTime, 1000);

  const clearSessionTimeout = () => {
    initEvnetTime();
    sessionStorage.removeItem(LAST_TIME_STAMP_KEY);
    message.destroy(WARNING_MESSEAGE_KEY);
    events.forEach((event) => {
      window.removeEventListener(event, resetEventTimeThrottled);
    });
  };

  useEffect(() => {
    if (loginedId > 0) {
      events.forEach((event) => {
        window.addEventListener(event, resetEventTimeThrottled);
      });
      resetEventTime();
    } else {
      clearSessionTimeout();
    }
    return () => clearSessionTimeout();
  }, [loginedId]);

  return <Fragment />;
}

function secondsToTime(e: number): string {
  const h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0');

  return `${h}:${m}:${s}`;
}
