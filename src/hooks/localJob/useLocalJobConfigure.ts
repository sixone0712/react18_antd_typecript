import { message } from 'antd';
import { LabeledValue } from 'antd/lib/select';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { localJobSiteInfoReducer, selectLocalJobSiteInfo } from '../../reducers/slices/localJob';
import useTypedSelector from '../../reducers/useTypedSelector';
import { useSiteList } from '../common/useSiteList';
import useUploadFiles, { ResponseUploadFile } from '../useUploadFiles';

export default function useLocalJobConfigure() {
  const dispatch = useDispatch();
  const { data: siteList, isFetching: isFetchingSiteList, refetch: refetchSiteList } = useSiteList();
  const { uploadFiles, setUploadFiles, setResponseFiles } = useUploadFiles();
  const siteInfo = useTypedSelector(selectLocalJobSiteInfo);

  const jobName = useMemo(() => siteInfo.jobName, [siteInfo.jobName]);

  const onChangeJobName: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      dispatch(
        localJobSiteInfoReducer({
          jobName: e.target.value ?? null,
        })
      );
    },
    [dispatch]
  );

  const selectSiteInfo = useMemo(
    (): LabeledValue => ({
      key: `${siteInfo.siteId}`,
      value: siteInfo.siteId as number,
      label: siteInfo.siteName,
    }),
    [siteInfo]
  );

  const setSelectSiteInfo = useCallback(
    ({ value, label }: LabeledValue) => {
      dispatch(
        localJobSiteInfoReducer({
          siteId: (value as number) ?? null,
          siteName: (label as string) ?? null,
        })
      );
    },
    [dispatch]
  );
  const onChangeFiles = useCallback((info: any) => {
    const { fileList, file } = info;
    const { status } = file;

    if (status === 'uploading') {
      // do noting
    } else if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    } else if (status === 'removed') {
      // do noting
    }
    setUploadFiles(fileList);
    const fileIdList: ResponseUploadFile[] = fileList.map((item: any) => {
      return {
        name: item.name,
        fileIndex: item.response?.fileIndex,
        uid: item.uid,
        status: item.status,
      };
    });

    setResponseFiles(fileIdList);
  }, []);

  return {
    siteList,
    isFetchingSiteList,
    refetchSiteList,
    selectSiteInfo,
    setSelectSiteInfo,
    uploadFiles,
    onChangeFiles,
    jobName,
    onChangeJobName,
  };
}
