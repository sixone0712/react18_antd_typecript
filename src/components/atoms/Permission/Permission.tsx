import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Row, Space, Switch } from 'antd';
import React, { useCallback } from 'react';
import { USER_ROLE_NAME } from '../../../lib/constants';
import { UserRolesBoolean } from '../../../reducers/slices/loginUser';

export type PermissionProps = {
  rules: UserRolesBoolean;
  setRules: React.Dispatch<React.SetStateAction<UserRolesBoolean>>;
  loggedInUserRoles: UserRolesBoolean;
};

export default function Permission({ rules, setRules, loggedInUserRoles }: PermissionProps): JSX.Element {
  const handleClick = useCallback(
    (name: USER_ROLE_NAME) => {
      switch (name) {
        case USER_ROLE_NAME.JOB:
          setRules((prev) => ({
            ...prev,
            isRoleJob: !prev.isRoleJob,
          }));
          break;

        case USER_ROLE_NAME.CONFIGURE:
          setRules((prev) => ({
            ...prev,
            isRoleConfigure: !prev.isRoleConfigure,
          }));
          break;

        case USER_ROLE_NAME.RULES:
          setRules((prev) => ({
            ...prev,
            isRoleRules: !prev.isRoleRules,
          }));
          break;

        case USER_ROLE_NAME.ADDRESS:
          setRules((prev) => ({
            ...prev,
            isRoleAddress: !prev.isRoleAddress,
          }));
          break;

        case USER_ROLE_NAME.ACCOUNT:
          setRules((prev) => ({
            ...prev,
            isRoleAccount: !prev.isRoleAccount,
          }));
          break;

        default:
          break;
      }
    },
    [setRules]
  );

  return (
    <Container align="middle" justify="center">
      <Section>
        <Space>
          <Name>{`• ${USER_ROLE_NAME.STATUS}`}</Name>
          <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} checked={true} disabled />
        </Space>
        <Space>
          <Name>{`• ${USER_ROLE_NAME.JOB}`}</Name>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            disabled={!loggedInUserRoles.isRoleJob}
            checked={rules.isRoleJob}
            onClick={() => handleClick(USER_ROLE_NAME.JOB)}
          />
        </Space>
      </Section>
      <Divider />
      <Section>
        <Space>
          <Name>{`• ${USER_ROLE_NAME.CONFIGURE}`}</Name>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            disabled={!loggedInUserRoles.isRoleConfigure}
            checked={rules.isRoleConfigure}
            onClick={() => handleClick(USER_ROLE_NAME.CONFIGURE)}
          />
        </Space>
        <Space>
          <Name>{`• ${USER_ROLE_NAME.RULES}`}</Name>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            disabled={!loggedInUserRoles.isRoleRules}
            checked={rules.isRoleRules}
            onClick={() => handleClick(USER_ROLE_NAME.RULES)}
          />
        </Space>
      </Section>
      <Divider />
      <Section>
        <Space>
          <Name>{`• ${USER_ROLE_NAME.ADDRESS}`}</Name>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            disabled={!loggedInUserRoles.isRoleAddress}
            checked={rules.isRoleAddress}
            onClick={() => handleClick(USER_ROLE_NAME.ADDRESS)}
          />
        </Space>
        <Space>
          <Name>{`• ${USER_ROLE_NAME.ACCOUNT}`}</Name>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            defaultChecked
            disabled={!loggedInUserRoles.isRoleAccount}
            checked={rules.isRoleAccount}
            onClick={() => handleClick(USER_ROLE_NAME.ACCOUNT)}
          />
        </Space>
      </Section>
    </Container>
  );
}

const Container = styled(Row)`
  flex-direction: column;
`;

const Section = styled(Row)``;

const Divider = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Name = styled.div`
  width: 7.5rem;
  text-align: right;
`;
