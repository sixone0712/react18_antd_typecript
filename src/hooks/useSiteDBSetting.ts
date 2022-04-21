import { useForm } from 'antd/lib/form/Form';
import { SwitchClickEventHandler } from 'antd/lib/switch';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';
import { useIsMutating, useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  postCrasConnection,
  postEmailConnection,
  postRssConnection,
  postSiteDBInfo,
  putSiteDBInfo,
} from '../lib/api/axios/requests';
import {
  ClientError,
  ReqPostCrasConnection,
  ReqPostEmailConnection,
  ReqPostRssConnection,
  ReqPostSiteDBInfo,
  ReqPutSiteDBInfo,
  SiteDBInfo,
} from '../lib/api/axios/types';
import md5 from '../lib/api/md5';
import {
  CRAS_LOCALHOST_NAME,
  DEFAULT_PASSWORD_VALUE,
  DISPLAY_LOCALHOST_NAME,
  RSS_LOCALHOST_NAME,
} from '../lib/constants';
import { openNotification } from '../lib/util/notification';
import {
  setSiteInfoDrawer,
  SiteDrawerOpenType,
  siteInfoDrawerType,
  siteInfoIsDrawer,
  siteInfoSelectedSite,
} from '../reducers/slices/configure';

export type TestConnStatusType = PresetStatusColorType | 'error(cras_info)';

export default function useSiteDBSetting() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [crasStatus, setCrasStatus] = useState<TestConnStatusType>('default');
  const [emailStatus, setEmailStatus] = useState<TestConnStatusType>('default');
  const [rssStatus, setRssStatus] = useState<TestConnStatusType>('default');
  const [localRssPassword, setLocalRssPassword] = useState('');
  const [localEmailPassword, setLocalEmailPassword] = useState('');
  const isDrawer = useSelector(siteInfoIsDrawer);
  const drawerType = useSelector(siteInfoDrawerType);
  const selectedSite = useSelector(siteInfoSelectedSite);
  const [form] = useForm<SiteDBInfo>();
  const [localhostCras, setLocalhostCras] = useState(false);
  const [localhostRss, setLocalhostRss] = useState(false);

  const crasMutation = useMutation((postData: ReqPostCrasConnection) => postCrasConnection(postData), {
    mutationKey: 'connection_test_cras_server',
    onError: () => {
      setCrasStatus('error');
    },
    onSuccess: () => {
      setCrasStatus('success');
    },
  });
  const emailMutation = useMutation((postData: ReqPostEmailConnection) => postEmailConnection(postData), {
    mutationKey: 'connection_test_email_server',
    onError: () => {
      setEmailStatus('error');
    },
    onSuccess: () => {
      setEmailStatus('success');
    },
  });
  const rssMutation = useMutation((postData: ReqPostRssConnection) => postRssConnection(postData), {
    mutationKey: 'connection_test_rss_server',
    onError: () => {
      setRssStatus('error');
    },
    onSuccess: () => {
      setRssStatus('success');
    },
  });
  const addMutation = useMutation((postData: ReqPostSiteDBInfo) => postSiteDBInfo(postData), {
    mutationKey: 'add_config_site_db_info',
    onError: (resData: AxiosError<ClientError>) => {
      openNotification('error', 'Error', resData.response?.data.errorMsg ?? 'Failed to add settings server info.');
      if (resData.response?.status !== 400) {
        // not bad request
        queryClient.fetchQuery('get_config_site_db_info');
        dispatch(setSiteInfoDrawer(false));
      }
    },
    onSuccess: () => {
      queryClient.fetchQuery('get_config_site_db_info');
      dispatch(setSiteInfoDrawer(false));
      openNotification('success', 'Success', 'Succeed to add settings server info.');
    },
  });
  const editMutation = useMutation((reqData: ReqPutSiteDBInfo) => putSiteDBInfo(reqData), {
    mutationKey: 'modify_config_site_db_info',
    onError: (resData: AxiosError<ClientError>) => {
      openNotification('error', 'Error', resData.response?.data.errorMsg ?? 'Failed to edit settings server info.');
      if (resData.response?.status !== 400) {
        // not bad request
        queryClient.fetchQuery('get_config_site_db_info');
        dispatch(setSiteInfoDrawer(false));
      }
    },
    onSuccess: () => {
      queryClient.fetchQuery('get_config_site_db_info');
      dispatch(setSiteInfoDrawer(false));
      openNotification('success', 'Success', 'Succeed to edit settings server info.');
    },
  });

  const isMutatingEdit = useIsMutating({ mutationKey: ['modify_config_site_db_info'] }) > 0 ? true : false;
  const isMutatingAdd = useIsMutating({ mutationKey: ['add_config_site_db_info'] }) > 0 ? true : false;
  const isRequestAddEdit = isMutatingEdit || isMutatingAdd;

  const testCrasServer = useCallback(
    (postData: ReqPostCrasConnection) => {
      setCrasStatus('processing');
      postData.crasAddress = convertCrasAddress(postData.crasAddress);
      crasMutation.mutate(postData);
    },
    [crasMutation, setCrasStatus]
  );

  const testEmailServer = useCallback(
    (postData: ReqPostEmailConnection) => {
      setEmailStatus('processing');
      if (postData.emailPassword === DEFAULT_PASSWORD_VALUE) postData.emailPassword = localEmailPassword;
      emailMutation.mutate(postData);
    },
    [emailMutation, setEmailStatus, localEmailPassword]
  );

  const testRssServer = useCallback(
    (postData: ReqPostRssConnection) => {
      setRssStatus('processing');
      postData.crasAddress = convertCrasAddress(postData.crasAddress);
      postData.rssAddress = convertRssAddress(postData.rssAddress);
      if (postData.rssPassword === DEFAULT_PASSWORD_VALUE) {
        postData.rssPassword = localRssPassword;
      } else {
        if (postData.rssPassword) postData.rssPassword = md5(postData.rssPassword);
        else postData.rssPassword = '';
      }
      rssMutation.mutate(postData);
    },
    [rssMutation, setRssStatus, localRssPassword]
  );

  const initStatus = useCallback(() => {
    setCrasStatus('default');
    setEmailStatus('default');
    setRssStatus('default');
  }, [setCrasStatus, setEmailStatus, setRssStatus]);

  const initFormData = useCallback(() => {
    if (isDrawer && drawerType === 'edit') {
      if (selectedSite !== undefined) {
        const formData = Object.entries(selectedSite).map(([key, value]) => {
          if (key === 'emailPassword') {
            setLocalEmailPassword(value);
            value = DEFAULT_PASSWORD_VALUE;
          }
          if (key === 'rssPassword') {
            setLocalRssPassword(value);
            value = DEFAULT_PASSWORD_VALUE;
          }
          if (key === 'crasAddress')
            if (value === CRAS_LOCALHOST_NAME) {
              setLocalhostCras(true);
              value = DISPLAY_LOCALHOST_NAME;
            } else {
              setLocalhostCras(false);
            }
          if (key === 'rssAddress') {
            if (value === RSS_LOCALHOST_NAME) {
              setLocalhostRss(true);
              value = DISPLAY_LOCALHOST_NAME;
            } else {
              setLocalhostRss(false);
            }
          }

          return {
            name: key,
            value: value,
          };
        });
        form.setFields(formData);
      }
    } else {
      setLocalRssPassword('');
      setLocalEmailPassword('');
      setLocalhostCras(false);
      setLocalhostRss(false);
      form.resetFields();
    }
  }, [isDrawer, drawerType, selectedSite, form]);

  const closeDrawer = useCallback(() => {
    if (isMutatingEdit || isMutatingAdd) return;
    dispatch(setSiteInfoDrawer(false));
  }, [dispatch, isMutatingEdit, isMutatingAdd]);

  const requestAdd = useCallback(
    (reqData: ReqPostSiteDBInfo) => {
      // MD5 encryption
      reqData.rssPassword = md5(reqData.rssPassword);
      addMutation.mutate(reqData);
    },
    [addMutation]
  );

  const requestEdit = useCallback(
    (reqData: ReqPutSiteDBInfo) => {
      console.log('reqData.emailPassword', reqData.emailPassword);
      console.log('reqData.rssPassword', reqData.rssPassword);

      if (reqData.emailPassword === DEFAULT_PASSWORD_VALUE) {
        reqData.emailPassword = localEmailPassword;
      }

      if (reqData.rssPassword === DEFAULT_PASSWORD_VALUE) {
        reqData.rssPassword = localRssPassword;
      } else {
        // MD5 encryption
        reqData.rssPassword = md5(reqData.rssPassword);
      }

      editMutation.mutate(reqData);
    },
    [editMutation, localRssPassword, localEmailPassword]
  );

  const serverRequest = useCallback(
    (type: SiteDrawerOpenType, data: SiteDBInfo) => {
      data.crasAddress = convertCrasAddress(data.crasAddress);
      data.rssAddress = convertRssAddress(data.rssAddress);
      if (type === 'add') {
        requestAdd(data);
      } else {
        requestEdit(data);
      }
    },
    [requestAdd, requestEdit]
  );

  const requestCrasStatus = useCallback(() => {
    const crasAddress = form.getFieldValue('crasAddress');
    const crasPort = form.getFieldValue('crasPort');
    testCrasServer({ crasAddress, crasPort });
  }, [form, testCrasServer]);

  const requestEmailStatus = useCallback(() => {
    const emailAddress = form.getFieldValue('emailAddress');
    const emailPort = form.getFieldValue('emailPort');
    const emailUserName = form.getFieldValue('emailUserName');
    const emailPassword = form.getFieldValue('emailPassword');
    testEmailServer({ emailAddress, emailPort, emailUserName, emailPassword });
  }, [form, testEmailServer]);

  const requestRssStatus = useCallback(() => {
    const rssAddress = form.getFieldValue('rssAddress');
    const rssPort = form.getFieldValue('rssPort');
    const rssUserName = form.getFieldValue('rssUserName');
    const rssPassword = form.getFieldValue('rssPassword');
    const crasAddress = form.getFieldValue('crasAddress');
    const crasPort = form.getFieldValue('crasPort');

    if (!crasAddress || !crasPort) {
      setRssStatus('error(cras_info)');
    } else {
      testRssServer({ rssAddress, rssPort, rssUserName, rssPassword, crasAddress, crasPort });
    }
  }, [form, testRssServer, setRssStatus]);

  const disabledCrasInput = useMemo(() => crasStatus === 'processing' || rssStatus === 'processing', [
    crasStatus,
    rssStatus,
  ]);

  const disabledCrasIPAddressInput = useMemo(
    () => crasStatus === 'processing' || rssStatus === 'processing' || localhostCras,
    [localhostCras, crasStatus, rssStatus]
  );

  const disabledRssIPAddressInput = useMemo(
    () => crasStatus === 'processing' || rssStatus === 'processing' || localhostRss,
    [localhostRss, crasStatus, rssStatus]
  );

  const disabledRssInput = useMemo(() => rssStatus === 'processing', [rssStatus]);

  const disabledEmailInput = useMemo(() => emailStatus === 'processing', [emailStatus]);

  const disabledApply = useMemo(
    () => crasStatus === 'processing' || emailStatus === 'processing' || rssStatus === 'processing' || isRequestAddEdit,
    [crasStatus, emailStatus, rssStatus, isRequestAddEdit]
  );

  const onFinish = useCallback(
    (value: SiteDBInfo) => {
      serverRequest(drawerType, value);
    },
    [drawerType, serverRequest]
  );

  const resetRssPassword = () => {
    form.setFieldsValue({
      rssPassword: '',
    });
  };

  const resetEmailPassword = () => {
    form.setFieldsValue({
      emailPassword: '',
    });
  };

  const onClickLocalhostCras: SwitchClickEventHandler = useCallback(
    (check, event) => {
      if (check) {
        setLocalhostCras(true);
        form.setFieldsValue({
          crasAddress: DISPLAY_LOCALHOST_NAME,
        });
      } else {
        form.resetFields(['crasAddress']);
        setLocalhostCras(false);
      }
    },
    [setLocalhostCras, form]
  );

  const onClickLocalhostRss: SwitchClickEventHandler = useCallback(
    (check, event) => {
      if (check) {
        setLocalhostRss(true);
        form.setFieldsValue({
          rssAddress: DISPLAY_LOCALHOST_NAME,
        });
      } else {
        form.resetFields(['rssAddress']);
        setLocalhostRss(false);
      }
    },
    [setLocalhostRss, form]
  );

  return {
    form,
    onFinish,
    crasStatus,
    emailStatus,
    rssStatus,
    initStatus,
    isDrawer,
    drawerType,
    closeDrawer,
    isRequestAddEdit,
    localhostCras,
    localhostRss,
    onClickLocalhostCras,
    onClickLocalhostRss,
    requestCrasStatus,
    requestEmailStatus,
    requestRssStatus,
    disabledCrasInput,
    disabledCrasIPAddressInput,
    disabledRssIPAddressInput,
    disabledEmailInput,
    disabledRssInput,
    resetRssPassword,
    resetEmailPassword,
    disabledApply,
    initFormData,
  };
}

const convertCrasAddress = (address: string) => {
  return address === DISPLAY_LOCALHOST_NAME ? CRAS_LOCALHOST_NAME : address;
};

const convertRssAddress = (address: string) => {
  return address === DISPLAY_LOCALHOST_NAME ? RSS_LOCALHOST_NAME : address;
};
