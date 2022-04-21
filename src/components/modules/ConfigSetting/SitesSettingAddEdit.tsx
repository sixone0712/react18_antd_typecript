import { blue } from '@ant-design/colors';
import { ApiOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge, Button, Col, Divider, Drawer, Form, Row, Space, Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import useSiteDBSetting, { TestConnStatusType } from '../../../hooks/useSiteDBSetting';
import { convertRemToPixels } from '../../../lib/util/remToPixcels';
import FormEmail from '../../atoms/CustomForm/FormEmail';
import FormIpAddress from '../../atoms/CustomForm/FormIpAddress';
import FormIpAddressWithLocalhost from '../../atoms/CustomForm/FormIpAddressWithLocalhost';
import FormName from '../../atoms/CustomForm/FormName';
import FormPassword from '../../atoms/CustomForm/FormPassword';
import FormPort from '../../atoms/CustomForm/FormPort';
import CustomIcon from '../../atoms/CustomIcon';
export type SitesSettingAddEditProps = {};

export default function SitesSettingAddEdit({}: SitesSettingAddEditProps): JSX.Element {
  const {
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
    onClickLocalhostCras,
    localhostRss,
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
  } = useSiteDBSetting();

  useEffect(() => {
    initStatus();
    initFormData();
  }, [isDrawer]);

  const DrawerTitle = useMemo(() => {
    const titleStyle = css`
      display: flex;
      align-items: center;
      .icon {
        margin-right: 0.5rem;
      }
    `;

    if (drawerType === 'add') {
      return (
        <div css={titleStyle}>
          <CustomIcon name="circle_plus" className="icon" />
          <span>Add Server Information</span>
        </div>
      );
    } else {
      return (
        <div css={titleStyle}>
          <CustomIcon name="circle_edit" className="icon" />
          <span>Edit Server Information</span>
        </div>
      );
    }
  }, [drawerType]);

  return (
    <Drawer
      title={DrawerTitle}
      placement="right"
      width={convertRemToPixels(67.25)}
      closable={true}
      onClose={closeDrawer}
      visible={isDrawer}
      destroyOnClose
      // getContainer={false}
      forceRender
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <FormInnerContainer>
          <FormInnerSection>
            <SettingTitle title="Cras Server Setting" status={crasStatus} requestStatus={requestCrasStatus} />
            <FormName label="User Name" name="crasCompanyName" disabled={disabledCrasInput} />
            <FormName label="Fab Name" name="crasFabName" disabled={disabledCrasInput} />
            <FormIpAddressWithLocalhost
              label="Address"
              name="crasAddress"
              disabled={disabledCrasIPAddressInput}
              localhost={localhostCras}
              onClickLocalhost={onClickLocalhostCras}
            />
            <FormPort label="Port" name="crasPort" disabled={disabledCrasInput} />
          </FormInnerSection>
          <Divider type="vertical" css={formDividerVStyle} />
          <FormInnerSection>
            <SettingTitle title="Email Server Setting" status={emailStatus} requestStatus={requestEmailStatus} />
            <FormIpAddress label="Address" name="emailAddress" disabled={disabledEmailInput} />
            <FormPort label="Port" name="emailPort" disabled={disabledEmailInput} />
            <FormName label="User Name" name="emailUserName" disabled={disabledEmailInput} />
            <FormPassword
              label="Password"
              name="emailPassword"
              disabled={disabledEmailInput}
              onClick={resetEmailPassword}
            />
            <FormEmail label={`Sender's E-mail`} name="emailFrom" disabled={disabledEmailInput} />
          </FormInnerSection>
          <Divider type="vertical" css={formDividerVStyle} />
          <FormInnerSection>
            <Form.Item css={settingTitleFormStyle}>
              <SettingTitle
                title="Rapid Collector Server Setting"
                status={rssStatus}
                requestStatus={requestRssStatus}
              />
            </Form.Item>
            <FormIpAddressWithLocalhost
              label="Address"
              name="rssAddress"
              disabled={disabledRssIPAddressInput}
              localhost={localhostRss}
              onClickLocalhost={onClickLocalhostRss}
            />
            <FormPort label="Port" name="rssPort" disabled={disabledRssInput} />
            <FormName label="User Name" name="rssUserName" disabled={disabledRssInput} />
            <FormPassword label="Password" name="rssPassword" disabled={disabledRssInput} onClick={resetRssPassword} />
          </FormInnerSection>
        </FormInnerContainer>

        <Divider type="horizontal" css={formDividerHStyle} />

        <Form.Item css={formSubmitStyle}>
          <Button
            type="primary"
            htmlType="submit"
            css={applyBtnstyle}
            loading={isRequestAddEdit}
            disabled={disabledApply}
          >
            Apply
          </Button>
        </Form.Item>
        <FormHidden name="siteId" />
        <FormHidden name="emailPassword" />
        <FormHidden name="rssPassword" />
      </Form>
    </Drawer>
  );
}

const formSubmitStyle = css`
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const applyBtnstyle = css`
  width: 20rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  margin-top: 1rem;
`;

const FormInnerContainer = styled(Row)`
  flex-direction: row;
  flex-wrap: nowrap;
  /* width: 41rem; */
`;
const FormInnerSection = styled(Col)`
  width: 20rem;
`;

const formDividerHStyle = css``;

const formDividerVStyle = css`
  height: auto;
  margin-left: 1rem;
  margin-right: 1rem;
`;

const FormHidden = styled(Form.Item)`
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
`;

interface SettingTitleProps {
  title: string;
  status: TestConnStatusType;
  requestStatus(): void;
}
function SettingTitle({ title, status, requestStatus }: SettingTitleProps) {
  const statusText = useMemo(() => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'processing':
        return 'Processing';
      case 'error':
        return 'Error';
      case 'error(cras_info)':
        return "Error (Please input 'Cras Server Setting Info'.)";
      default:
        return 'Click the Icon to test the connection';
    }
  }, [status]);

  const statusIcon = useMemo(() => {
    switch (status) {
      case 'error(cras_info)':
        return 'error';
      default:
        return status;
    }
  }, [status]);

  return (
    <Form.Item css={settingTitleFormStyle}>
      <div css={settingTitleStyle}>
        <Space>
          <div className="title-text">{title}</div>
          {status === 'processing' ? (
            <Spin size={'small'} />
          ) : (
            <ApiOutlined css={settingConnIconStyle} onClick={requestStatus} />
          )}
        </Space>
        <div>
          <Badge status={statusIcon} text={statusText} css={settingTitleBadgeStyle} />
        </div>
      </div>
    </Form.Item>
  );
}

const settingTitleFormStyle = css`
  margin-bottom: 0;
`;

const settingTitleStyle = css`
  display: flex;
  flex-direction: column;
  .title-text {
    color: ${blue[4]};
    font-size: 1rem;
  }
  margin-bottom: 0.5rem;
`;

const settingConnIconStyle = css`
  color: ${blue[4]};
  &:hover {
    color: ${blue[6]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

const settingTitleBadgeStyle = css`
  margin-left: 0.5rem;
`;
