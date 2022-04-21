import { PaperClipOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge, Col, Row, Space } from 'antd';
import React, { useMemo } from 'react';
import useUploadFiles from '../../../hooks/useUploadFiles';
import { selectLocalJobErrorNotice, selectLocalJobSiteInfo } from '../../../reducers/slices/localJob';
import useTypedSelector from '../../../reducers/useTypedSelector';
import PopupTip from '../../atoms/PopupTip';

export type LocalJobCheckProps = {};
export default function LocalJobCheck({}: LocalJobCheckProps): JSX.Element {
  const { responseFiles } = useUploadFiles();
  const siteInfo = useTypedSelector(selectLocalJobSiteInfo);
  const { isEmail, recipient } = useTypedSelector(selectLocalJobErrorNotice);
  const doneFilesCount = useMemo(() => responseFiles.filter((item) => item.status === 'done').length, [responseFiles]);

  return (
    <>
      <JobName align="middle">
        <Space css={spaceStyle}>
          <Badge color="blue" />
          <span>Job Name</span>
        </Space>
        <JobNameValue>{siteInfo.jobName}</JobNameValue>
      </JobName>
      <SiteName align="middle">
        <Space css={spaceStyle}>
          <Badge color="blue" />
          <span>User-Fab Name</span>
        </Space>
        <SelectedSite>{siteInfo.siteName}</SelectedSite>
      </SiteName>
      <FileUpload align="top">
        <Space css={spaceStyle}>
          <Badge color="blue" />
          <span>Files</span>
        </Space>
        <UploadFiles>
          <UploadFileCount>{doneFilesCount} Files</UploadFileCount>
          {responseFiles.map((item) => (
            <UploadFileList key={item.uid}>
              <div css={loadFileStyle(item.status)}>
                <PaperClipOutlined className="icon" />
                <span title={item.name} className="text">{`${item.name} ${
                  item.status === 'error' ? '(Error)' : ''
                }`}</span>
              </div>
            </UploadFileList>
          ))}
        </UploadFiles>
      </FileUpload>
      <OtherSetting>
        <Space css={spaceStyle}>
          <Badge color="blue" />
          <span>Other Settings</span>
        </Space>
        <ErrorNotice>
          <div className="title">Error Notice</div>
          <div className="value">
            {!isEmail ? (
              'None'
            ) : recipient.length > 0 ? (
              <div>
                <PopupTip
                  value={`${recipient.length} Recipients`}
                  list={recipient.map((item) => item.label as string)}
                  placement="right"
                  color="blue"
                />
              </div>
            ) : (
              <div>{`${recipient.length} Recipients`}</div>
            )}
          </div>
        </ErrorNotice>
      </OtherSetting>
    </>
  );
}

const JobName = styled(Row)`
  font-size: 1rem;
  flex-wrap: nowrap;
`;

const SiteName = styled(Row)`
  margin-top: 2rem;
  font-size: 1rem;
  flex-wrap: nowrap;
`;

const FileUpload = styled(Row)`
  font-size: 1rem;
  margin-top: 2rem;
  flex-wrap: nowrap;
`;

const OtherSetting = styled(Row)`
  font-size: 1rem;
  margin-top: 2rem;
  flex-wrap: nowrap;
`;

const ErrorNotice = styled.div`
  display: flex;
  .title {
    width: 12rem;
  }
`;

const JobNameValue = styled(Col)``;
const SelectedSite = styled(Col)``;
const UploadFiles = styled(Col)``;
const UploadFileCount = styled(Row)``;
const UploadFileList = styled(Row)`
  margin-left: 0.5rem;
`;

const spaceStyle = css`
  min-width: 13.25rem;
`;

const loadFileStyle = (status: string | undefined) => css`
  .icon {
    margin-right: 0.5rem;
    color: rgba(0, 0, 0, 0.45);
  }
  .text {
    color: ${status === 'error' && 'red'};
    text-decoration-line: ${status === 'error' && 'line-through'};
    width: 49rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  display: flex;
  align-items: center;
`;
