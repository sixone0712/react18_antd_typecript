import { DesktopOutlined, FileAddOutlined, InboxOutlined, ReloadOutlined, PushpinOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Input, Row, Select, Space, Upload } from 'antd';
import React from 'react';
import useLocalJobConfigure from '../../../hooks/localJob/useLocalJobConfigure';
import { API_URL, NAME_MAX_LENGTH } from '../../../lib/constants';

export type LocalJobConfigureProps = {};

export default function LocalJobConfigure({}: LocalJobConfigureProps): JSX.Element {
  const {
    siteList,
    isFetchingSiteList,
    refetchSiteList,
    selectSiteInfo,
    setSelectSiteInfo,
    uploadFiles,
    onChangeFiles,
    jobName,
    onChangeJobName,
  } = useLocalJobConfigure();

  return (
    <>
      <JobName align="middle">
        <Space css={spaceStyle}>
          <PushpinOutlined />
          <span>Job Name</span>
        </Space>
        <Input
          placeholder="Input a job name"
          maxLength={NAME_MAX_LENGTH}
          value={jobName ?? undefined}
          onChange={onChangeJobName}
        />
      </JobName>
      <SelectSiteName align="middle">
        <Space css={spaceStyle}>
          <DesktopOutlined />
          <span>User-Fab Name</span>
        </Space>
        <Select
          showSearch
          labelInValue
          css={selectStyle}
          value={selectSiteInfo}
          placeholder="Select a user-fab"
          onSelect={setSelectSiteInfo}
          loading={isFetchingSiteList}
          disabled={isFetchingSiteList}
          optionFilterProp="children"
          filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {siteList?.map((item) => (
            <Select.Option key={item.siteId} value={item.siteId} label={item.crasCompanyFabName}>
              {item.crasCompanyFabName}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          css={btnStyle}
          onClick={() => refetchSiteList}
          loading={isFetchingSiteList}
          disabled={isFetchingSiteList}
        />
      </SelectSiteName>
      <FileUpload align="top">
        <Space css={spaceStyle}>
          <FileAddOutlined />
          <span>Files</span>
        </Space>
        <div css={uploadDraggerStyle}>
          <Upload.Dragger
            name="file"
            multiple
            maxCount={10}
            action={API_URL.UPLOAD_STATUS_LOCAL_JOB_FILE_URL}
            fileList={uploadFiles}
            onChange={onChangeFiles}
            withCredentials
          >
            <div>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
                <br />
                (The maximum number of files to be uploaded is 10.)
              </p>
            </div>
          </Upload.Dragger>
        </div>
      </FileUpload>
    </>
  );
}

const JobName = styled(Row)`
  font-size: 1rem;
  flex-wrap: nowrap;
  /* height: 14.0625rem; */
  input {
    width: 33.75rem;
  }
`;

const SelectSiteName = styled(Row)`
  font-size: 1rem;
  margin-top: 6.25rem;
  flex-wrap: nowrap;
  /* height: 14.0625rem; */
`;
const FileUpload = styled(Row)`
  font-size: 1rem;
  margin-top: 6.25rem;
  flex-wrap: nowrap;
  /* height: 14.0625rem; */
`;

const spaceStyle = css`
  min-width: 13.25rem;
  /* font-size: 1.25rem; */
`;

const selectStyle = css`
  min-width: 33.75rem;
  text-align: center;
  font-size: inherit;
`;

const uploadDraggerStyle = css`
  .ant-upload .ant-upload-drag {
    width: 33.75rem;
  }
  .ant-upload-list.ant-upload-list-text {
    width: 33.75rem;
  }
`;

const btnStyle = css`
  border-radius: 0.625rem;
  margin-left: 0.5rem;
`;
