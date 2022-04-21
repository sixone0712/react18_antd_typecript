import { AxiosError } from 'axios';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  requestFailureTooMayRequestMessage,
  requestSuccessMessage,
} from '../../components/modules/ErrorLog/Modal/ErrorLogDownloadReqeust';
import { postErrorLogDownload } from '../../lib/api/axios/requests';
import { MUTATION_KEY } from '../../lib/api/query/mutationKey';
import { openNotification } from '../../lib/util/notification';
import {
  errorLogReqDownload,
  errorLogShow,
  errorLogSiteInfo,
  setErrorLogShowReducer,
} from '../../reducers/slices/errorLog';
import { ErrorLogReqDownload, PLAN_FTP_TYPE } from '../../types/errorLog';

export default function useErrorLogDownloadRequest() {
  const dispatch = useDispatch();
  const [date, setDate] = useState<[Moment, Moment]>([moment(), moment()]);
  const siteInfo = useSelector(errorLogSiteInfo);
  const reqDownload = useSelector(errorLogReqDownload);
  const visible = useSelector(errorLogShow('isDownloadModal'));

  const setVisible = useCallback(
    (value: boolean) => {
      dispatch(
        setErrorLogShowReducer({
          isDownloadModal: value,
        })
      );
    },
    [dispatch]
  );

  const { mutateAsync: mutateDownload, isLoading: isFetchingDownload } = useMutation(
    (reqData: ErrorLogReqDownload) => postErrorLogDownload(reqData),
    {
      mutationKey: MUTATION_KEY.ERROR_LOG_DOWNLOAD,
      onError: (error: AxiosError) => {
        const { response } = error;
        if (response && response.status === 429) {
          openNotification('error', 'Error', requestFailureTooMayRequestMessage, error);
        } else {
          openNotification('error', 'Error', 'Failed to request error log download!', error);
        }
      },
      onSuccess: () => {
        openNotification('success', 'Success', requestSuccessMessage);
      },
      onSettled: () => {
        setVisible(false);
      },
    }
  );

  const command = useMemo(() => {
    if (reqDownload.command) {
      if (reqDownload.type !== 'FTP') {
        const startDate = date[0].format('YYYYMMDD_HHmmss');
        const endDate = date[1].format('YYYYMMDD_HHmmss');
        const dateRange = `${startDate}-${endDate}`;
        return reqDownload.command.trim().replace(/YYYYMMDD_HHmmss-YYYYMMDD_HHmmss/gi, dateRange);
      } else {
        const splitData = reqDownload.command.trim().split(',');
        const joinData = splitData.map((item) => item.trim()).join(',');
        return joinData;
      }
    } else {
      return '';
    }
  }, [date, reqDownload]);

  const onClose = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onOk = useCallback(async () => {
    const { siteId } = siteInfo;
    const { error_code, occurred_date, type, equipment_name, device, process } = reqDownload;

    await mutateDownload({
      siteId: siteId as number,
      error_code: error_code as string,
      occurred_date: occurred_date as string,
      equipment_name: equipment_name as string,
      type: type as PLAN_FTP_TYPE,
      command,
      start: date[0].format('YYYY-MM-DD HH:mm:ss'),
      end: date[1].format('YYYY-MM-DD HH:mm:ss'),
      device: device as string,
      process: process as string,
    });

    setVisible(false);
  }, [setVisible, reqDownload, command, siteInfo, mutateDownload, date]);

  function onChangeDate(value: RangeValue<Moment> | null, dateString: [string, string]) {
    if (value && value[0] && value[1]) {
      setDate([value[0], value[1]]);
    }
  }

  useEffect(() => {
    if (visible) {
      const { occurred_date: occurrence_date, before, after } = reqDownload;

      if (before && after) {
        const newBefore =
          before.trim().toLowerCase() === 'now'
            ? moment().hour(0).minute(0).second(0)
            : moment(occurrence_date, 'YYYY-MM-DD HH:mm:ss')
                .hour(0)
                .minute(0)
                .second(0)
                .subtract(moment.duration(+before, 'd'));

        const newAfter =
          after.trim().toLowerCase() === 'now'
            ? moment().hour(23).minute(59).second(59)
            : moment(occurrence_date, 'YYYY-MM-DD HH:mm:ss')
                .hour(23)
                .minute(59)
                .second(59)
                .add(moment.duration(+after, 'd'));

        setDate([newBefore, newAfter]);
      }
    }
  }, [reqDownload, visible]);

  return {
    siteInfo,
    visible,
    onOk,
    onClose,
    date,
    onChangeDate,
    command,
    reqDownload,
    isFetchingDownload,
  };
}
