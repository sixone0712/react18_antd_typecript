import { blue } from '@ant-design/colors';
import { BookOutlined, FileProtectOutlined, PartitionOutlined, SettingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Col, Dropdown, Menu, Row, Space } from 'antd';
import React from 'react';
import useDashboardHeader, { NavType } from '../../../hooks/useDashboardHeader';
import CustomIcon from '../../atoms/CustomIcon';
import AccountChangePassword from '../Account/AccountChangePassword';

const { SubMenu } = Menu;

const Container = styled(Row)`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
`;

const InnerContainer = styled(Row)`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 90rem;
`;

const NavSection = styled(Row)`
  flex-wrap: nowrap;
`;

const Title = styled(Col)`
  align-items: center;
  min-width: 14rem;
  font-size: 1.714rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;

const LoginUserSection = styled(Row)``;

type DashBoardNavBarProps = {};

function DashBoardNavBar({}: DashBoardNavBarProps): JSX.Element {
  const {
    onLogout,
    onChangePassword,
    currentKey,
    onClickNavItem,
    loggedInUser,
    visiblePassword,
    setVisiblePassword,
  } = useDashboardHeader();

  return (
    <Container>
      <InnerContainer>
        <NavSection>
          <Title onClick={() => onClickNavItem({ key: NavType.STATUS_REMOTE })}>Log Monitor</Title>
          <Menu theme="dark" mode="horizontal" css={menuStyle} selectedKeys={currentKey}>
            <SubMenu key={NavType.STATUS} icon={<PartitionOutlined />} title="Status">
              <Menu.Item key={NavType.STATUS_REMOTE} onClick={onClickNavItem}>
                Remote
              </Menu.Item>
              <Menu.Item key={NavType.STATUS_LOCAL} onClick={onClickNavItem}>
                Local
              </Menu.Item>
              {loggedInUser.roles.isRoleJob && (
                <Menu.Item key={NavType.STATUS_ERROR_LOG} onClick={onClickNavItem}>
                  Error Log Download
                </Menu.Item>
              )}
            </SubMenu>
            {loggedInUser.roles.isRoleConfigure && (
              <Menu.Item key={NavType.CONFIGURE} icon={<SettingOutlined />} onClick={onClickNavItem}>
                Configure
              </Menu.Item>
            )}
            {loggedInUser.roles.isRoleRules && (
              <SubMenu key={NavType.RULES} icon={<FileProtectOutlined />} title="Rules">
                <Menu.Item key={NavType.RULES_CONVERT} onClick={onClickNavItem}>
                  Convert Rules
                </Menu.Item>
                <Menu.Item key={NavType.RULES_CRAS} onClick={onClickNavItem}>
                  Cras Data
                </Menu.Item>
              </SubMenu>
            )}
            {loggedInUser.roles.isRoleAddress && (
              <Menu.Item key={NavType.ADDRESS_BOOK} icon={<BookOutlined />} onClick={onClickNavItem}>
                Address Book
              </Menu.Item>
            )}
            {loggedInUser.roles.isRoleAccount && (
              <Menu.Item key={NavType.ACCOUNT} icon={<CustomIcon name="idcard" />} onClick={onClickNavItem}>
                Account
              </Menu.Item>
            )}
          </Menu>
        </NavSection>
        <LoginUserSection>
          <Dropdown
            overlay={() => LoginUserMenu(loggedInUser.username, onLogout, onChangePassword)}
            trigger={['click']}
          >
            <a css={dropdownStyle}>
              {loggedInUser.username && (
                <Space css={spaceStyle}>
                  <CustomIcon name="user" css={userIconStyle} />
                  <div>{loggedInUser.username}</div>
                </Space>
              )}
            </a>
          </Dropdown>
        </LoginUserSection>
      </InnerContainer>
      <AccountChangePassword visible={visiblePassword} setVisible={setVisiblePassword} />
    </Container>
  );
}

function LoginUserMenu(username: string, onLogout: () => void, onChangePassword: () => void) {
  return (
    <Menu css={loginUserMenuStyle}>
      {username !== 'Administrator' && <Menu.Item onClick={onChangePassword}>Change Password</Menu.Item>}
      <Menu.Item onClick={onLogout}>Logout</Menu.Item>
    </Menu>
  );
}

const menuStyle = css`
  width: 50rem;
  min-width: 50rem;
  font-size: 1rem;
`;

const dropdownStyle = css`
  color: white;
  &:hover {
    color: ${blue[2]};
  }
`;

const userIconStyle = css`
  font-size: 2rem;
`;

const loginUserMenuStyle = css`
  margin-top: -1rem;
  text-align: center;
  .ant-dropdown-menu-item:hover {
    background-color: #e6f7ff;
    font-weight: 700;
  }
`;

const spaceStyle = css`
  display: flex; // Space에 flex를 설정하지 않으면 Navar의 높이가 튀어나온다...
  .ant-space-item {
    display: flex; //Space의 align 속성이 적용되지 않기 대문에 내부 item에 flex 적용
  }
`;

export default DashBoardNavBar;
